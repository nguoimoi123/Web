import { connectToDatabase } from '../../../../../lib/db';

export async function POST(req, { params }) {
  const { cartId, productId } = params; // Lấy cartId và productId từ URL params

  // Lấy dữ liệu từ body request
  const { quantity } = await req.json();

  try {
    // Kiểm tra xem có đủ thông tin cần thiết không
    if (!quantity) {
      return new Response(
        JSON.stringify({ error: 'Thiếu thông tin số lượng' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Kết nối đến cơ sở dữ liệu
    const connection = await connectToDatabase();

    // Thêm chi tiết vào bảng cart_details
    const [result] = await connection.execute(
      `INSERT INTO cart_detail (cart_id, id_product, quantity)
       VALUES (?, ?, ?)`,
      [cartId, productId, quantity]
    );

    return new Response(
      JSON.stringify({ message: 'Chi tiết giỏ hàng đã được thêm' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Lỗi khi thêm chi tiết vào giỏ hàng:', error);
    return new Response(
      JSON.stringify({ error: 'Lỗi khi thêm chi tiết vào giỏ hàng' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
