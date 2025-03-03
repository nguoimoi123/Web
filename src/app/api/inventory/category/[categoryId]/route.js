import { connectToDatabase } from '../../../../../lib/db';

// Lấy dữ liệu category
export async function GET(req, { params }) {
  const connection = await connectToDatabase(); // Kết nối đến cơ sở dữ liệu

  try {
    const categoryId = parseInt(params.categoryId); // Lấy 'categoryId' từ URL, ví dụ: /api/categories/1
    console.log("Parsed Category ID:", categoryId); // Kiểm tra giá trị đã parse

    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({ error: 'Invalid category ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Truy vấn cơ sở dữ liệu với 'categoryId' tương ứng
    const [rows] = await connection.execute('SELECT * FROM category WHERE category_id = ?', [categoryId]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error retrieving category:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Cập nhật category
export async function PUT(req, { params }) {
  const { categoryId } = params;  // Lấy categoryId từ params URL
  const { category_name } = await req.json(); // Lấy dữ liệu từ body (ví dụ: category_name)

  const connection = await connectToDatabase();
  const [result] = await connection.execute(
    "UPDATE category SET category_name = ? WHERE category_id = ?",
    [category_name, categoryId] // Sử dụng category_name và categoryId để cập nhật
  );

  if (result.affectedRows === 0) {
    return new Response(JSON.stringify({ error: 'Category not found or no changes made.' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: 'Category updated successfully.' }), {
    status: 200,
  });
}

// Xóa category
export async function DELETE(req, { params }) {
  const { categoryId } = params; // Lấy categoryId từ params URL

  const connection = await connectToDatabase();

  try {
    const [result] = await connection.execute(
      "DELETE FROM category WHERE category_id = ?",
      [categoryId]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Category deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
