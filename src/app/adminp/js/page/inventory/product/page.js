import { useState, useEffect } from "react";
import Image from "next/image";
import { ProductFormModal } from "./ProductFormModal";
import { fetchProducts,addProduct, deleteProduct } from "./productActions";
import  Pagination  from "../../../../../Components/Pagination";

// API URL
const API_URL = "http://localhost:3000/api/inventory/product";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [form, setForm] = useState({
    product_id: null,
    product_name: "",
    description: "",
    title: "",
    stock: "",
    img_url: "",
    price: "",
    category_id: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Fetch Products
  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data = await response.json();

      // Cập nhật img_url để chứa đường dẫn chính xác từ thư mục public/uploads
      const updatedData = data.map((product) => ({
        ...product,
        img_url: product.img_url ? `${product.img_url}` : '/image.jpg',
      }));

      setProducts(updatedData);
    } catch (error) {
      setError("Unable to load products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/inventory/category");
      if (!response.ok) {
        throw new Error("Failed to load categories.");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError("Unable to load categories.");
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = () => {
    // Sau khi thêm hoặc sửa thành công, tải lại danh sách sản phẩm
    fetchProductsData();
  };

  // Handle Edit
  const handleEdit = (product) => {
    setIsEditing(true);
    setForm({ ...product });
    setIsModalOpen(true);
  };



 // Handle Delete
 const handleDelete = async (productId) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const data = await deleteProduct(productId);
      setProducts((prev) => prev.filter((product) => product.product_id !== productId));
      alert("Product deleted successfully");
    } catch (error) {
      setError("Unable to delete product.");
      console.error("Error deleting product:", error);
    }
  }
};

  // Fetch products and categories on mount
  useEffect(() => {
    fetchCategories();
    fetchProductsData();
  }, []);

  // Lọc sản phẩm theo category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === parseInt(selectedCategory))
    : products;

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Hàm xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <main>
      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">Inventory</h1>
        {loading && <div className="text-center text-blue-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        <div className="mb-4 flex justify-between items-center">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mb-4 p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setIsEditing(false);
              setForm({
                product_id: null,
                product_name: "",
                description: "",
                title: "",
                stock: "",
                img_url: "",
                price: "",
                category_id: "",
              });
              setIsModalOpen(true);
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300"
          >
            Add Product
          </button>
        </div>

        {currentProducts.length === 0 ? (
        <div className="text-center text-gray-600 mt-6">
          No products available. Please add one!
        </div>
      ) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
    {currentProducts.map((product) => (
      <div key={product.product_id} className="border rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-semibold">{product.product_name}</h2>
        <Image
          src={product.img_url || "/image.jpg"}
          alt={product.product_name}
          width={500}
          height={500}
          className="object-cover rounded mb-4"
          style={{ height: "150px" }}
        />
        <p>{product.description}</p>
        <p>Title: {product.title}</p>
        <p>
          Category:{" "}
          {categories.find((cat) => cat.category_id === product.category_id)
            ?.category_name || "Unknown"}
        </p>
        <p>Stock: {product.stock}</p>
        <p>Price: {product.price}</p>
        <div className="flex justify-around space-x-2 mt-4">
          <button
            onClick={() => handleEdit(product)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product.product_id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          categories={categories}
          handleImageChange={handleImageChange} // Thêm handler cho thay đổi ảnh
        />
      </div>
    </main>
  );
}


