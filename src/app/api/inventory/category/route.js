import { connectToDatabase } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export async function GET(req) {
    const connection = await connectToDatabase();
  
    try {
      const [rows] = await connection.execute('SELECT * FROM category');
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
    const { category_name } = await req.json(); // Lấy dữ liệu từ request body
  
    try {
      const [result] = await connection.execute(
        'INSERT INTO category (category_name) VALUES (?)',
        [category_name]
      );
      
      // Trả về danh mục đã thêm với id vừa tạo
      return new Response(
        JSON.stringify({ category_id: result.insertId, category_name }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      return new Response(
        JSON.stringify({ error: 'Không thể thêm danh mục' }),
        { status: 500 }
      );
    }
  }

  
  
  
  
  
      

  