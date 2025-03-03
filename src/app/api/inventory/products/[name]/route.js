import { connectToDatabase } from '../../../../../lib/db';

export async function GET(req, { params }) {
  const { name } = params; // Lấy name từ params URL

  if (!name) {
    return new Response(JSON.stringify({ error: 'Tên sản phẩm không hợp lệ' }), { status: 400 });
  }

  const connection = await connectToDatabase();

  try {
    const [rows] = await connection.execute(
      `SELECT 
        p.product_id, 
        p.product_name, 
        p.description, 
        p.stock, 
        p.img_url, 
        p.price, 
        c.category_id, 
        c.category_name 
      FROM products p
      LEFT JOIN category c ON p.category_id = c.category_id
      WHERE p.product_name LIKE ?`,
      [`%${name}%`] // Sử dụng LIKE để tìm kiếm
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Không tìm thấy sản phẩm nào' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
