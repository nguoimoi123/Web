import { connectToDatabase } from '../../../../lib/db';

export async function GET(req, { params }) {
    const { userId } =  await params;  // Lấy userId từ URL params

    if (!userId) {
        return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Truy vấn giỏ hàng của người dùng cụ thể, bao gồm cả hình ảnh sản phẩm
        const [rows] = await connection.execute(`
            SELECT 
                c.ucart_id, 
                c.product_id, 
                p.product_name, 
                p.price, 
                c.quantity, 
                c.created_at, 
                u.id AS user_id, 
                u.name AS user_name,
                p.img_url  -- Thêm trường img_url để lấy hình ảnh sản phẩm
            FROM ucart c
            JOIN products p ON c.product_id = p.product_id
            JOIN users u ON c.user_id = u.id
            WHERE c.user_id = ?
        `, [userId]);

        // Chuyển đổi kết quả thành JSON
        const cartItems = rows.map(row => ({
            ucart_id: row.ucart_id,
            product_id: row.product_id,
            product_name: row.product_name,
            price: row.price,
            quantity: row.quantity,
            created_at: row.created_at,
            user: {
                id: row.user_id,
                name: row.user_name
            },
            img_url: row.img_url // Thêm trường img_url vào kết quả
        }));

        return new Response(JSON.stringify(cartItems), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
        return new Response(JSON.stringify({ error: 'Lỗi lấy giỏ hàng!' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function DELETE(req, { params }) {
    const { userId } = await params;  // Lấy userId từ URL params

    // Kiểm tra nếu userId không có
    if (!userId) {
        return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Kiểm tra nếu giỏ hàng của người dùng có sản phẩm nào
        const [existingCartItems] = await connection.execute(`
            SELECT * FROM ucart WHERE user_id = ?
        `, [userId]);

        // Nếu không có sản phẩm nào trong giỏ hàng
        if (existingCartItems.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Cart is empty' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Xóa tất cả sản phẩm khỏi giỏ hàng của người dùng
        await connection.execute(`
            DELETE FROM ucart WHERE user_id = ?
        `, [userId]);

        return new Response(
            JSON.stringify({ message: 'All products removed from cart successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error("Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng:", err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
