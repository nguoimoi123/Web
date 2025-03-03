import { connectToDatabase } from '../../../lib/db';

export async function GET(req) {
    const connection = await connectToDatabase();

    try {
        // Truy vấn dữ liệu từ bảng `shipping` cùng thông tin người dùng từ bảng `users`
        const [rows] = await connection.execute(`
            SELECT 
                s.id_shipping, 
                s.id_user, 
                s.name AS shipping_name, 
                s.phone AS shipping_phone, 
                s.address AS shipping_address, 
                s.note AS shipping_note,
                u.id AS id, 
                u.name AS name, 
                u.email AS email  
            FROM shipping s
            JOIN users u ON s.id_user = u.id
        `);

        // Chuyển đổi kết quả thành JSON
        const shippingData = rows.map(row => ({
            id_shipping: row.id_shipping,
            id_user: row.id_user,
            shipping_name: row.shipping_name,
            shipping_phone: row.shipping_phone,
            shipping_address: row.shipping_address,
            shipping_note: row.shipping_note,
            user: {
                id: row.id,
                name: row.name,
                email: row.email  // Bạn có thể thêm các trường khác ở đây
            }
        }));

        // Trả về dữ liệu dưới dạng JSON
        return new Response(JSON.stringify(shippingData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu shipping:", err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi lấy dữ liệu shipping!' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
