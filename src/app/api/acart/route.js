import { connectToDatabase } from '../../../lib/db';

// API GET để lấy thông tin giỏ hàng
export async function GET(req) {
    const connection = await connectToDatabase();

    try {
        // Truy vấn thông tin giỏ hàng kết hợp với người dùng và thông tin giao hàng
        const [rows] = await connection.execute(`
            SELECT 
                c.cart_id, 
                c.cart_code, 
                c.state, 
                c.payment, 
                c.id_user, 
                c.id_shipping,
                s.name AS name, 
                s.address AS address, 
                s.phone AS phone
            FROM cart c
            LEFT JOIN users u ON c.id_user = u.id
            LEFT JOIN shipping s ON c.id_shipping = s.id_shipping
        `);

        // Kiểm tra nếu không có giỏ hàng nào
        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Không tìm thấy giỏ hàng nào' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Biến đổi dữ liệu trước khi trả về
        const cartData = rows.map(row => ({
            cart_id: row.cart_id,
            cart_code: row.cart_code,
            state: row.state,
            payment: row.payment,
            user: {
                id: row.id_user,
            },
            shipping: {
                id: row.id_shipping,
                name: row.name,
                address: row.address,
                phone: row.phone
            }
        }));

        // Trả về dữ liệu giỏ hàng dưới dạng JSON
        return new Response(JSON.stringify(cartData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu giỏ hàng:', err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi lấy dữ liệu giỏ hàng' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
