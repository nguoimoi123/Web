import { connectToDatabase } from '../../../../lib/db';

export async function GET(req, { params }) {
  // In ra để kiểm tra
  console.log('Received params:', params);

  // Kiểm tra xem id có tồn tại trong params không
  if (!params || !params.userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const connection = await connectToDatabase(); // Kết nối đến cơ sở dữ liệu

  try {
    const userId = parseInt(params.userId); // Lấy 'userId' từ URL path, ví dụ: /api/users/1
    console.log("Parsed User ID:", userId); // Kiểm tra giá trị đã parse

    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: 'Invalid ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Truy vấn cơ sở dữ liệu với 'userId' tương ứng
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error retrieving user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
