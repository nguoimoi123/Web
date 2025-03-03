import { connectToDatabase } from '../../../../lib/db';


export async function PUT(req, { params }) {
    const { cartId } = await params;  // Lấy cartId từ URL params

    if (!cartId) {
        return new Response(
            JSON.stringify({ error: 'cartId là bắt buộc' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { state } = await req.json(); // Lấy dữ liệu state từ body

    if (!state) {
        return new Response(
            JSON.stringify({ error: 'State là bắt buộc' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Thực hiện query để cập nhật state của giỏ hàng
        const [result] = await connection.execute(`
            UPDATE cart
            SET state = ?
            WHERE cart_id = ?
        `, [state, cartId]);

        // Kiểm tra nếu không có giỏ hàng nào bị ảnh hưởng
        if (result.affectedRows === 0) {
            return new Response(
                JSON.stringify({ error: 'Không tìm thấy giỏ hàng với cartId này' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Trả về thông tin giỏ hàng sau khi cập nhật
        return new Response(
            JSON.stringify({ cartId, state }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('Lỗi khi cập nhật state giỏ hàng:', err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi cập nhật giỏ hàng' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}