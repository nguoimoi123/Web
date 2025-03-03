import { connectToDatabase } from '../../../../lib/db';


// API để lấy thông tin chi tiết giỏ hàng
export async function GET(req, { params }) {
  const { cartId } = await params; // Lấy cartId từ dynamic route parameter

  if (!cartId) {
      return new Response(
          JSON.stringify({ error: 'Cart ID không hợp lệ' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
  }

  const connection = await connectToDatabase();

  try {
      // Truy vấn chi tiết giỏ hàng và trạng thái giỏ hàng
      const [rows] = await connection.execute(`
          SELECT
              cd.cart_detail_id,
              cd.cart_id,
              p.product_name,
              p.price,
              cd.quantity,
              (p.price * cd.quantity) AS total_price,
              c.state AS cart_state -- Lấy trạng thái từ bảng cart
          FROM cart_detail cd
          JOIN products p ON cd.product_id = p.product_id
          JOIN cart c ON cd.cart_id = c.cart_id -- Thêm join với bảng cart
          WHERE cd.cart_id = ?
      `, [cartId]);

      // Tính tổng giá của giỏ hàng
      const totalCartPrice = rows.reduce((total, row) => total + row.total_price, 0);

      // Trả về chi tiết giỏ hàng và tổng giá
      const cartDetail = {
          cart_code: `Cart-${cartId}`,
          items: rows.map(row => ({
              cart_detail_id: row.cart_detail_id,
              cart_id: row.cart_id,
              product_name: row.product_name,
              price: row.price,
              quantity: row.quantity,
              total_price: row.total_price,
          })),
          cart_state: rows.length > 0 ? rows[0].cart_state : null, // Lấy trạng thái từ bảng cart
          totalCartPrice: totalCartPrice,
      };

      return new Response(
          JSON.stringify(cartDetail),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
  } catch (err) {
      console.error('Lỗi khi lấy chi tiết giỏ hàng:', err);
      return new Response(
          JSON.stringify({ error: 'Lỗi khi lấy chi tiết giỏ hàng' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
  }
}


// API để thêm sản phẩm vào giỏ hàng
export async function POST(req, { params }) {
    const { cartId } = await params; // Lấy cartId từ dynamic route parameter

    if (!cartId) {
        return new Response(
            JSON.stringify({ error: 'Cart ID không hợp lệ' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { product_id, quantity } = await req.json(); // Lấy productId và quantity từ body request

    // Kiểm tra dữ liệu đầu vào
    if (!product_id|| !quantity || quantity <= 0) {
        return new Response(
            JSON.stringify({ error: 'Dữ liệu không hợp lệ (thiếu productId hoặc quantity)' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Chèn sản phẩm vào bảng cart_detail
        const [result] = await connection.execute(`
            INSERT INTO cart_detail (product_id, quantity, cart_id)
            VALUES (?, ?, ?)
        `, [product_id, quantity, cartId]);

        // Trả về thông báo thành công và thông tin sản phẩm đã thêm
        return new Response(
            JSON.stringify({ 
                message: 'Sản phẩm đã được thêm vào giỏ hàng', 
                cart_id: cartId, 
                product_id: product_id, 
                quantity: quantity, 
                cart_detail_id: result.insertId 
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi thêm sản phẩm vào giỏ hàng' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
