import { connectToDatabase } from '../../../lib/db';

export async function GET(req) {
  const connection = await connectToDatabase();

  try {
    const [rows] = await connection.execute('SELECT * FROM users');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500
    });
  }
}

export async function POST(req) {
  const connection = await connectToDatabase();
  const body = await req.json();
  const { name, email } = body;

  try {
    const [result] = await connection.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    return new Response(JSON.stringify({ id: result.insertId, name, email }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500
    });
  }
}


