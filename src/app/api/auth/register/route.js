import { connectToDatabase } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
      const { name, email, password } = await req.json();
      const connection = await connectToDatabase();
  
      // Mã hóa mật khẩu trước khi lưu vào database
  
  
      await connection.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
  
      return new Response(JSON.stringify({ message: 'User registered successfully' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }
  
