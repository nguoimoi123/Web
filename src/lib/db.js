import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Kết nối database thành công!');
    return connection;
  } catch (error) {
    console.error('Lỗi khi kết nối database:', error);
    throw error;
  }
}
