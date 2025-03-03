import { connectToDatabase } from '../../../../lib/db';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = 'your_secret_key';

export async function GET(req) {
  const connection = await connectToDatabase();
  
  try {
    // Thực hiện JOIN giữa bảng products, categories và brands
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
    `);

    // Chuyển đổi kết quả thành định dạng JSON với thông tin danh mục và thương hiệu
    const products = rows.map(row => ({
      product_id: row.product_id,
      product_name: row.product_name,
      img_url: row.img_url,
      description: row.description,
      price: row.price,
      category_id: row.category_id,
      title: row.title,
      stock: row.stock,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: {
        category_id: row.category_id,
        category_name: row.category_name,
        created_at: row.created_at,
        updated_at: row.updated_at
      },
    }));

    return new Response(JSON.stringify(products), {
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

export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  // Xử lý file upload
  const imageFile = data.img_url; // Đây là đối tượng File
  let imageUrl = '';

  // Nếu có file được upload
  if (imageFile instanceof File) {
    try {
      // Tạo tên file duy nhất
      const fileName = `${uuidv4()}-${imageFile.name}`;
      const fileBuffer = await imageFile.arrayBuffer();
      
      // Lưu file vào thư mục public/images
      await writeFile(`public/uploads/${fileName}`, Buffer.from(fileBuffer));
      imageUrl = `/uploads/${fileName}`;
    } catch (error) {
      console.error('Lỗi khi lưu file:', error);
      return new Response(JSON.stringify({ error: 'Lỗi upload ảnh' }), { status: 500 });
    }
  } else {
    // Nếu không upload file, sử dụng URL từ formData
    imageUrl = data.img_url;
  }

  // Validate các trường khác
  if (!data.product_name || !imageUrl || !data.description || 
      !data.price || !data.category_id || !data.stock || !data.title) {
    return new Response(JSON.stringify({ error: 'Thiếu tham số bắt buộc' }), { status: 400 });
  }

  const connection = await connectToDatabase();

  try {
    // Chuyển đổi kiểu dữ liệu
    const category_id = parseInt(data.category_id);
    const price = parseFloat(data.price);
    const stock = parseInt(data.stock);

    // Thêm sản phẩm vào database
    const [result] = await connection.execute(
      `INSERT INTO products (product_name, img_url, description, price, category_id, stock, title)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.product_name, imageUrl, data.description, price, category_id, stock, data.title]
    );

    return new Response(JSON.stringify({
      product_id: result.insertId,
      img_url: imageUrl,
      ...data
    }), { status: 201 });

  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), { status: 500 });
  }
}
