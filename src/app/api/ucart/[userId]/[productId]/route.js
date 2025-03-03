import { connectToDatabase } from '../../../../../lib/db';

export async function GET(req, { params }) {
    const { userId, productId } = params;  // Lấy userId và productId từ URL params

    if (!userId || !productId) {
        return new Response(
            JSON.stringify({ error: 'User ID and Product ID are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Truy vấn giỏ hàng của người dùng và sản phẩm cụ thể
        const [rows] = await connection.execute(`
            SELECT 
                c.ucart_id, 
                c.product_id, 
                p.product_name, 
                p.price, 
                c.quantity, 
                c.created_at, 
                u.id AS user_id, 
                u.name AS user_name
            FROM ucart c
            JOIN products p ON c.product_id = p.product_id
            JOIN users u ON c.user_id = u.id
            WHERE c.user_id = ? AND c.product_id = ?
        `, [userId, productId]);

        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Product not found in the cart' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Chuyển đổi kết quả thành JSON
        const cartItem = rows.map(row => ({
            ucart_id: row.ucart_id,
            product_id: row.product_id,
            product_name: row.product_name,
            price: row.price,
            quantity: row.quantity,
            created_at: row.created_at,
            user: {
                id: row.user_id,
                name: row.user_name
            }
        }))[0];  // Vì mỗi userId và productId chỉ có một kết quả

        return new Response(JSON.stringify(cartItem), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Lỗi khi lấy thông tin giỏ hàng:", err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi lấy thông tin giỏ hàng!' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
export async function PUT(req, { params }) {
    const { userId, productId } = params;  // Lấy userId và productId từ URL params

    if (!userId || !productId) {
        return new Response(
            JSON.stringify({ error: 'User ID and Product ID are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    let quantity;
    try {
        const data = await req.json();  // Lấy dữ liệu JSON từ request body
        quantity = data.quantity;  // Lấy giá trị quantity từ JSON
    } catch (err) {
        console.error("Lỗi khi phân tích JSON:", err);
        return new Response(
            JSON.stringify({ error: 'Invalid JSON format in request body' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (quantity <= 0) {
        return new Response(
            JSON.stringify({ error: 'Quantity must be greater than 0' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng của người dùng
        const [existingCartItem] = await connection.execute(`
            SELECT quantity FROM ucart WHERE user_id = ? AND product_id = ?
        `, [userId, productId]);

        if (existingCartItem.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Product not found in the cart' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        await connection.execute(`
            UPDATE ucart 
            SET quantity = ? 
            WHERE user_id = ? AND product_id = ?
        `, [quantity, userId, productId]);

        return new Response(
            JSON.stringify({ message: 'Quantity updated successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error("Lỗi khi cập nhật giỏ hàng:", err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi cập nhật giỏ hàng' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
export async function DELETE(req, { params }) {
    const { userId, productId } = params;  // Lấy userId và productId từ URL params

    // Kiểm tra nếu userId hoặc productId không có
    if (!userId || !productId) {
        return new Response(
            JSON.stringify({ error: 'User ID and Product ID are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Kiểm tra nếu sản phẩm có tồn tại trong giỏ hàng của người dùng
        const [existingCartItem] = await connection.execute(`
            SELECT * FROM ucart WHERE user_id = ? AND product_id = ?
        `, [userId, productId]);

        // Nếu không tìm thấy sản phẩm, trả về lỗi
        if (existingCartItem.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Product not found in the cart' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Xóa sản phẩm khỏi giỏ hàng của người dùng
        await connection.execute(`
            DELETE FROM ucart WHERE user_id = ? AND product_id = ?
        `, [userId, productId]);

        return new Response(
            JSON.stringify({ message: 'Product removed from cart successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}