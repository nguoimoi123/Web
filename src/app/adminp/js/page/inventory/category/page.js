import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { CategoryFormModal } from "./CategoryFormModal";
import { fetchCategories, deleteCategory, updateCategory, addCategory } from "./categoryActions";  // Import các hàm action từ categoryActions.js
import "../.././../../css/category.css"
const API_URL = "http://192.168.1.44:3000/api/inventory/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ category_id: null, category_name: "" });

  // Hàm lấy danh sách danh mục
  const fetchCategoriesData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.44:3000/api/inventory/category");
  
      // Kiểm tra xem có phải là HTML hay không
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("text/html")) {
        const htmlText = await response.text();
        console.error("Received HTML instead of JSON:", htmlText);
        throw new Error("Received HTML instead of JSON");
      }
  
      // Nếu là JSON thì parse
      const data = await response.json();
      setCategories(data);
  
    } catch (error) {
      setError("Unable to load categories.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Hàm xử lý khi nhấn sửa
  const handleEdit = (category) => {
    setIsEditing(true);
    setForm({ category_id: category.category_id, category_name: category.category_name });
    setIsModalOpen(true);
  };

  // Hàm submit form (thêm hoặc sửa)
  const handleSubmit = async () => {
  console.log("Submitting form with data:", form); // Kiểm tra log dữ liệu gửi đi

  try {
    const response = isEditing
      ? await fetch(`http://192.168.1.44:3000/api/inventory/category/${form.category_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        })
      : await fetch("http://192.168.1.44:3000/api/inventory/category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

    console.log("Response:", response); // Kiểm tra log phản hồi từ API

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ API nếu có
      throw new Error(errorData?.message || "Error submitting category");
    }

    const updatedCategory = await response.json();
    console.log("Updated category:", updatedCategory); // Kiểm tra dữ liệu trả về từ API

    setCategories((prev) =>
      isEditing
        ? prev.map((cat) =>
            cat.category_id === updatedCategory.category_id ? updatedCategory : cat
          )
        : [...prev, updatedCategory]
    );

    setIsModalOpen(false);
  } catch (error) {
    console.error("Error submitting form:", error);
    setError(error.message);  // Hiển thị thông báo lỗi chi tiết
  }
};

  
  // Hàm xóa danh mục
  const handleDelete = async (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`http://192.168.1.44:3000/api/inventory/category/${categoryId}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Error deleting category");
        }
  
        const data = await response.json();
        console.log(data.message); // Kiểm tra phản hồi từ API
  
        // Cập nhật lại danh sách categories sau khi xóa
        setCategories((prev) => prev.filter((cat) => cat.category_id !== categoryId));
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Unable to delete category");
      }
    }
  };
  

  // Lấy dữ liệu danh mục khi component mount
  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <main>
    <div className=" mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">Categories</h1>
      {loading && <div className="text-center text-blue-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}
      <button
            onClick={() => {
              setIsEditing(false);
              setForm({ category_id: null, category_name: "", description: "" });
              setIsModalOpen(true);
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-red-500 transition duration-300 ml-auto"
          >
            Add Category
          </button>
      <div className="text-center text-gray-600 mt-6">
      {!loading && !error && (
        
          <Table>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {categories.map((category) => (
                <Table.Row key={category.category_id}>
                  <Table.Cell>{category.category_id}</Table.Cell>
                  <Table.Cell>{category.category_name}</Table.Cell>
                  <Table.Cell>
                    <button onClick={() => handleEdit(category)} className="text-blue-600">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.category_id)}
                      className="text-red-600 ml-2"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        
      )}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
      </div>
    </div>
    </main>
  );
}
