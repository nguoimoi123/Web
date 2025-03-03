import { connectToDatabase } from '../../../../../lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { unlink } from 'fs/promises';
export async function GET(req, { params }) {
  const { productId } = await params;  // Lấy productId từ params URL

  const connection = await connectToDatabase();

  try {
    // Thực hiện JOIN giữa bảng products và category để lấy thông tin sản phẩm theo productId
    const [rows] = await connection.execute(`
      SELECT 
        p.product_id, 
        p.product_name, 
        p.description, 
        p.stock, 
        p.img_url, 
        p.price,
        p.title, 
        c.category_id, 
        c.category_name
      FROM products p
      LEFT JOIN category c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [productId]);  // Sử dụng productId từ URL để truy vấn

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Chuyển đổi kết quả thành định dạng JSON với thông tin danh mục
    const product = rows.map(row => ({
      product_id: row.product_id,
      product_name: row.product_name,
      img_url: row.img_url,
      description: row.description,
      price: row.price,
      category_id: row.category_id,
      title: row.title,
      stock: row.stock,
      category: {
        category_id: row.category_id,
        category_name: row.category_name,
      },
    }))[0];  // Chỉ lấy sản phẩm đầu tiên vì query đã lọc theo product_id

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Lấy `product_id` từ URL trong API
export async function PUT(req) {
  const url = new URL(req.url, `http://localhost`);  // Thay localhost bằng địa chỉ server của bạn
  const productId = url.pathname.split('/').pop(); // Lấy productId từ URL

  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  let imageUrl = data.img_url; // URL ảnh (nếu có)
  let oldImageUrl = ''; // Biến để lưu ảnh cũ

  // Kiểm tra nếu có ảnh mới được tải lên
  const imageFile = data.img_url instanceof File ? data.img_url : null;
  if (imageFile) {
    try {
      // Kiểm tra đường dẫn ảnh cũ trong cơ sở dữ liệu
      const connection = await connectToDatabase();
      const [rows] = await connection.execute(
        `SELECT img_url FROM products WHERE product_id = ?`,
        [productId]
      );

      if (rows.length > 0) {
        oldImageUrl = rows[0].img_url; // Lấy URL ảnh cũ từ cơ sở dữ liệu
        const oldImagePath = path.join(process.cwd(), `public${oldImageUrl}`);

        // Xóa ảnh cũ nếu tồn tại
        try {
          await unlink(oldImagePath);
          console.log('Xóa ảnh cũ thành công');
        } catch (error) {
          console.error('Lỗi khi xóa ảnh cũ:', error);
        }
      }

      // Tạo tên file duy nhất cho ảnh mới
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      await mkdir(uploadsDir, { recursive: true });

      const fileName = `${uuidv4()}-${imageFile.name}`;
      const fileBuffer = await imageFile.arrayBuffer();

      // Lưu ảnh mới vào thư mục uploads
      await writeFile(path.join(uploadsDir, fileName), Buffer.from(fileBuffer));
      imageUrl = `/uploads/${fileName}`;
    } catch (error) {
      console.error('Lỗi khi lưu file:', error);
      return new Response(JSON.stringify({ error: 'Lỗi upload ảnh' }), { status: 500 });
    }
  }

  // Kiểm tra các tham số bắt buộc
  if (!productId || !data.product_name || !imageUrl || !data.description || 
      !data.price || !data.category_id || !data.stock || !data.title) {
    return new Response(JSON.stringify({ error: 'Thiếu tham số bắt buộc' }), { status: 400 });
  }

  try {
    // Chuyển đổi kiểu dữ liệu
    const category_id = parseInt(data.category_id);
    const price = parseFloat(data.price);
    const stock = parseInt(data.stock);

    // Cập nhật sản phẩm vào cơ sở dữ liệu
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      `UPDATE products 
       SET product_name = ?, img_url = ?, description = ?, price = ?, category_id = ?, stock = ?, title = ? 
       WHERE product_id = ?`,
      [data.product_name, imageUrl, data.description, price, category_id, stock, data.title, productId]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'Sản phẩm không tồn tại' }), { status: 404 });
    }

    return new Response(JSON.stringify({
      message: 'Cập nhật sản phẩm thành công!',
      product_id: productId,
      img_url: imageUrl,
      ...data
    }), { status: 200 });

  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), { status: 500 });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url, `http://localhost`);  // Thay localhost bằng địa chỉ server của bạn
  const productId = url.pathname.split('/').pop(); // Lấy productId từ URL

  if (!productId) {
    return new Response(JSON.stringify({ error: 'Product ID không hợp lệ' }), { status: 400 });
  }

  const connection = await connectToDatabase();

  try {
    // Lấy thông tin sản phẩm từ cơ sở dữ liệu để lấy đường dẫn ảnh
    const [product] = await connection.execute(
      'SELECT img_url FROM products WHERE product_id = ?',
      [productId]
    );

    if (product.length === 0) {
      return new Response(JSON.stringify({ error: 'Sản phẩm không tồn tại' }), { status: 404 });
    }

    const imageUrl = product[0].img_url;

    // Xóa ảnh nếu có (trừ ảnh mặc định)
    if (imageUrl && imageUrl !== '/uploads/default-product.jpg') {
      const imagePath = path.join(process.cwd(), 'public', imageUrl);
      try {
        await unlink(imagePath);  // Xóa ảnh khỏi thư mục
        console.log('Ảnh đã được xóa khỏi thư mục');
      } catch (err) {
        console.error('Lỗi khi xóa ảnh:', err);
        return new Response(JSON.stringify({ error: 'Không thể xóa ảnh' }), { status: 500 });
      }
    }

    // Xóa sản phẩm khỏi cơ sở dữ liệu
    const [deleteResult] = await connection.execute(
      'DELETE FROM products WHERE product_id = ?',
      [productId]
    );

    if (deleteResult.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'Không thể xóa sản phẩm' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Sản phẩm đã được xóa thành công!' }), { status: 200 });

  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), { status: 500 });
  }
}