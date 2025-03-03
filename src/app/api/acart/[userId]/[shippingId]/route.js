import { connectToDatabase } from '../../../../../lib/db';


// API POST để tạo giỏ hàng mới
export async function POST(req, { params }) {

    function generateCartCode() {
        const timestamp = Date.now(); // Lấy thời gian hiện tại
        const randomPart = Math.random().toString(36).substring(2, 8); // Tạo chuỗi ngẫu nhiên
        return `CART-${timestamp}-${randomPart}`; // Kết hợp thời gian và chuỗi ngẫu nhiên
    }
    
    const { userId, shippingId } = await params; // Lấy userId và shippingId từ URL params

    if (!userId || !shippingId) {
        return new Response(
            JSON.stringify({ error: 'userId và shippingId là bắt buộc' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { state, payment } = await req.json(); // Lấy dữ liệu từ body (không cần cart_code nữa)

    if (!state || !payment) {
        return new Response(
            JSON.stringify({ error: 'state và payment là bắt buộc' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const cart_code = generateCartCode(); // Tạo cart_code duy nhất

    const connection = await connectToDatabase();

    try {
        // Thực hiện query để insert vào bảng cart
        const [result] = await connection.execute(`
            INSERT INTO cart (cart_code, state, payment, id_user, id_shipping)
            VALUES (?, ?, ?, ?, ?)
        `, [cart_code, state, payment, userId, shippingId]);

        // Trả về giỏ hàng đã tạo
        const newCart = {
            cart_id: result.insertId,
            cart_code,
            state,
            payment,
            id_user: userId,
            id_shipping: shippingId
        };

        return new Response(JSON.stringify(newCart), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('Lỗi khi tạo giỏ hàng:', err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi tạo giỏ hàng' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

