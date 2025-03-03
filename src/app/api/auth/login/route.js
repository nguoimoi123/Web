import { connectToDatabase } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const connection = await connectToDatabase();

    // Truy vấn người dùng từ database
    const [rows] = await connection.execute(
      'SELECT id, role, password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id, role, password: storedPassword } = rows[0];

    // So sánh mật khẩu trực tiếp (KHÔNG BẢO MẬT)
    if (password !== storedPassword) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Tạo token mới
    const token = jwt.sign({ email, id, role }, SECRET_KEY, { expiresIn: '1h' });

    // Xóa token cũ nếu role là admin
    const deleteUserToken = role === 1 ? 'user_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;' : '';

    // Chọn cookie name theo role
    const cookieName = role === 1 ? 'admin_token' : 'user_token';

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${deleteUserToken}${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
