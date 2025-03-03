import { connectToDatabase } from '../../../lib/db';


export async function GET(req, { params }) {
    const connection = await connectToDatabase();

    try {
        // Truy vấn để lấy tên sản phẩm, tổng doanh thu và trạng thái
        const [rows] = await connection.execute(`
            SELECT
                p.product_name AS product_name,
                SUM(cd.quantity * p.price) AS total_revenue,
                c.state AS state,
                SUM(cd.quantity) AS total_quantity_sold
            FROM
                cart_detail cd
            INNER JOIN 
                products p ON cd.product_id = p.product_id
            INNER JOIN 
                cart c ON cd.cart_id = c.cart_id
            GROUP BY 
                cd.product_id, c.state;

            `);

        // Trả về kết quả
        return new Response(
            JSON.stringify(rows),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('Lỗi khi truy vấn tổng doanh thu và trạng thái:', err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi truy vấn tổng doanh thu và trạng thái' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}


export async function POST(req, { params }) {

    const { cart_id, product_id, quantity } = await req.json(); // Lấy productId và quantity từ body request

    // Kiểm tra dữ liệu đầu vào
    if (!product_id || !quantity || quantity <= 0 || !cart_id) {
        return new Response(
            JSON.stringify({ error: 'Dữ liệu không hợp lệ (thiếu productId hoặc quantity)' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Chèn sản phẩm vào bảng cart_detail
        const [result] = await connection.execute(`
            INSERT INTO cart_detail (id_product, quantity, cart_id)
            VALUES (?, ?, ?)
        `, [product_id, quantity, cart_id]);

        // Trả về thông báo thành công và thông tin sản phẩm đã thêm
        return new Response(
            JSON.stringify({ 
                message: 'Sản phẩm đã được thêm vào giỏ hàng', 
                cart_id: cart_id, 
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
