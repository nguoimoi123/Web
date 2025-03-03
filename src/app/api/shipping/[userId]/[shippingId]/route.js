import { connectToDatabase } from '../../../../../lib/db';

export async function PUT(req, { params }) {
    const { userId, shippingId } = await params;  // Lấy userId và shippingId từ URL params

    // Lấy dữ liệu gửi từ request body
    let { name, phone, address, note } = await req.json();

    // Kiểm tra xem dữ liệu có đầy đủ không
    if (!name || !phone || !address) {
        return new Response(
            JSON.stringify({ error: 'Thiếu thông tin bắt buộc: name, phone, address' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Kết nối với cơ sở dữ liệu
    const connection = await connectToDatabase();

    try {
        // Kiểm tra xem địa chỉ giao hàng có tồn tại không
        const [existingShipping] = await connection.execute(`
            SELECT * FROM shipping WHERE id_shipping = ? AND id_user = ?
        `, [shippingId, userId]);

        if (existingShipping.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Địa chỉ giao hàng không tồn tại hoặc không thuộc về người dùng này' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Thực hiện câu lệnh UPDATE để cập nhật địa chỉ giao hàng
        const [result] = await connection.execute(`
            UPDATE shipping
            SET name = ?, phone = ?, address = ?, note = ?
            WHERE id_shipping = ? AND id_user = ?
        `, [name, phone, address, note, shippingId, userId]);

        // Kiểm tra nếu dữ liệu được cập nhật thành công
        if (result.affectedRows > 0) {
            return new Response(
                JSON.stringify({ message: 'Cập nhật địa chỉ giao hàng thành công!' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Không có thay đổi nào được thực hiện' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (err) {
        console.error("Lỗi khi cập nhật địa chỉ giao hàng:", err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi cập nhật địa chỉ giao hàng!' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}