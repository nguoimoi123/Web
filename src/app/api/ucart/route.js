import { connectToDatabase } from "../../../lib/db";


export async function GET(req) {
    const connection = await connectToDatabase();

    try {
        const [rows] = await connection.execute(`
            SELECT 
                c.ucart_id, 
                c.product_id, 
                p.product_name, 
                p.price, 
                c.quantity, 
                c.created_at, 
                u.id, 
                u.name
            FROM ucart c
            JOIN products p ON c.product_id = p.product_id
            JOIN users u ON c.user_id = u.id
        `);

        // Chuyển đổi kết quả thành JSON
        const cartItems = rows.map(row => ({
            ucart_id: row.ucart_id,
            product_id: row.product_id,
            product_name: row.product_name,
            price: row.price,
            quantity: row.quantity,
            created_at: row.created_at,
            user: {
                id: row.id,
                name: row.name
            }
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



//Thêm sản phẩm vào giỏ hàng
export async function POST(req) {
    const connection = await connectToDatabase();

    try {
        const body = await req.text();  // Lấy dữ liệu raw từ body
        if (!body) {
            return new Response(JSON.stringify({ error: "Không có dữ liệu trong yêu cầu!" }), { status: 400 });
        }

        let data;
        try {
            data = JSON.parse(body);  // Parse dữ liệu JSON
        } catch (error) {
            return new Response(JSON.stringify({ error: "Dữ liệu JSON không hợp lệ!" }), { status: 400 });
        }

        const { user_id, product_id, quantity } = data;

        if (!user_id || !product_id || !quantity) {
            return new Response(JSON.stringify({ error: "Thông tin thiếu sót!" }), { status: 400 });
        }

        // Kiểm tra xem người dùng có tồn tại không
        const [user] = await connection.query("SELECT id FROM users WHERE id = ?", [user_id]);
        if (!user.length) {
            return new Response(JSON.stringify({ error: "Tài khoản không tồn tại!" }), { status: 404 });
        }

        // Kiểm tra sản phẩm có đủ hàng không
        const [product] = await connection.query("SELECT stock FROM products WHERE product_id = ?", [product_id]);
        if (!product.length || product[0].stock < quantity) {
            return new Response(JSON.stringify({ error: "Sản phẩm không đủ hàng!" }), { status: 400 });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const [existing] = await connection.query("SELECT * FROM ucart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
        if (existing.length) {
            await connection.query("UPDATE ucart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?", [quantity, user_id, product_id]);
            return new Response(JSON.stringify({ message: "Đã cập nhật giỏ hàng!" }), { status: 200 });
        } else {
            await connection.query("INSERT INTO ucart (user_id, product_id, quantity, created_at) VALUES (?, ?, ?, NOW())", [user_id, product_id, quantity]);
            return new Response(JSON.stringify({ message: "Đã thêm sản phẩm vào giỏ hàng!" }), { status: 200 });
        }

    } catch (err) {
        console.error("Lỗi khi thêm giỏ hàng:", err);
        return new Response(JSON.stringify({ error: "Lỗi thêm giỏ hàng!" }), { status: 500 });
    }
}



// Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(id) {
    const connection = await connectToDatabase();
    try {
        await connection.query("DELETE FROM cart WHERE id = ?", [id]);
        return { message: "Đã xoá sản phẩm khỏi giỏ hàng!" };
    } catch (err) {
        throw new Error("Lỗi xóa giỏ hàng!");
    }
}
