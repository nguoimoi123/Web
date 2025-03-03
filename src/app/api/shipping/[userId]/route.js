import { connectToDatabase } from '../../../../lib/db';

export async function GET(req, { params }) {
    const { userId } = await params; // Đảm bảo params được await

    if (!userId) {
        return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const connection = await connectToDatabase();

    try {
        // Truy vấn dữ liệu từ bảng `shipping` với userId từ URL
        const [rows] = await connection.execute(`
            SELECT 
                s.id_shipping, 
                s.id_user, 
                s.name AS shipping_name, 
                s.phone AS shipping_phone, 
                s.address AS shipping_address, 
                s.note AS shipping_note,
                u.id AS user_id, 
                u.name AS user_name, 
                u.email AS user_email
            FROM shipping s
            JOIN users u ON s.id_user = u.id
            WHERE s.id_user = ?
        `, [userId]);

        // Chuyển đổi kết quả thành JSON
        const shippingData = rows.map(row => ({
            id_shipping: row.id_shipping,
            id_user: row.id_user,
            name: row.shipping_name,
            phone: row.shipping_phone,
            address: row.shipping_address,
            note: row.shipping_note,
            user: {
                id: row.user_id,
                name: row.user_name,
                email: row.user_email
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

export async function POST(req, { params }) {
    const { userId } = await params;  // Lấy userId từ URL params

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
        // Thực hiện câu lệnh INSERT vào bảng `shipping`
        const [result] = await connection.execute(`
            INSERT INTO shipping (id_user, name, phone, address, note) 
            VALUES (?, ?, ?, ?, ?)
        `, [userId, name, phone, address, note]);

        // Kiểm tra nếu dữ liệu được thêm thành công
        if (result.affectedRows > 0) {
            const id_shipping = result.insertId; // Lấy id của địa chỉ giao hàng vừa thêm
            return new Response(
                JSON.stringify({ message: 'Thêm địa chỉ giao hàng thành công!', id_shipping }),
                { status: 201, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Không thể thêm địa chỉ giao hàng!' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (err) {
        console.error("Lỗi khi thêm địa chỉ giao hàng:", err);
        return new Response(
            JSON.stringify({ error: 'Lỗi khi thêm địa chỉ giao hàng!' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}


export async function PUT(req, { params }) {
    const { userId } = await params;  // Lấy userId từ URL params
  
    // Kiểm tra xem userId có tồn tại không
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    // Lấy thông tin giao hàng từ request body
    const { name, phone, address, note } = await req.json();
  
    // Kiểm tra xem tất cả các trường cần thiết có tồn tại không
    if (!name || !phone || !address) {
      return new Response(
        JSON.stringify({ error: 'Name, phone, and address are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    // Kết nối tới database
    const connection = await connectToDatabase();
  
    try {
      // Cập nhật dữ liệu giao hàng trong database
      const [result] = await connection.execute(
        `UPDATE shipping
         SET name = ?, phone = ?, address = ?, note = ?
         WHERE id_user = ?`,
        [name, phone, address, note, userId]
      );
  
      // Kiểm tra xem có bản ghi nào được cập nhật không
      if (result.affectedRows === 0) {
        return new Response(
          JSON.stringify({ error: 'Không tìm thấy thông tin giao hàng của người dùng này' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Trả về thông báo thành công kèm theo id_shipping
      const id_shipping = userId; // Hoặc nếu có một trường id_shipping riêng trong bảng shipping, thay thế userId bằng trường đó
      return new Response(
        JSON.stringify({ message: 'Thông tin giao hàng đã được cập nhật', id_shipping }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin giao hàng:", err);
      return new Response(
        JSON.stringify({ error: 'Lỗi khi cập nhật thông tin giao hàng' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
}
