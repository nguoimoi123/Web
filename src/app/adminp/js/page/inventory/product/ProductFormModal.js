import { useState, useEffect } from "react";
import Image from "next/image";

export function ProductFormModal({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  isEditing,
  categories,
}) {
  const [previewImage, setPreviewImage] = useState(null);

  // Hàm xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, img_url: file });
      setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh preview
    }
  };

  // Cập nhật form khi isEditing thay đổi, đảm bảo useEffect luôn được gọi
  useEffect(() => {
    setForm((prevForm) => ({ ...prevForm, product_id: form.product_id }));
  }, [isEditing, form.product_id, setForm]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_name", form.product_name);
    formData.append("description", form.description);
    formData.append("title", form.title);
    formData.append("stock", form.stock);
    formData.append("price", form.price);
    formData.append("category_id", form.category_id);

    if (form.img_url instanceof File) {
      formData.append("img_url", form.img_url); // Nếu có ảnh mới
    } else {
      formData.append("img_url", form.img_url || ""); // Nếu không có ảnh mới
    }

    // In ra các tham số đã gửi đi
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log("Dữ liệu gửi lên: ", data);

    const url = isEditing
      ? `/api/inventory/product/${form.product_id}`
      : `/api/inventory/product`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        const successMessage = isEditing
          ? "Sản phẩm đã được cập nhật thành công!"
          : "Sản phẩm đã được thêm thành công!";
        alert(successMessage);
        onSubmit(); // Gọi onSubmit để tải lại sản phẩm từ trang cha
        onClose(); // Đóng modal
      } else {
        alert(result.error || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
      alert("Lỗi khi gửi dữ liệu lên server!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/4">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Các input field */}
          <div className="mb-4">
            <input
              type="text"
              value={form.product_name || ""}
              placeholder="Product Name *"
              onChange={(e) => setForm({ ...form, product_name: e.target.value })}
              className="input-field w-full p-2 border rounded"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Product Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Image Preview */}
          {(previewImage || form.img_url) && (
            <div className="mb-4 relative h-48">
              <Image
                src={previewImage || form.img_url}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "/default-product.jpg";
                }}
              />
            </div>
          )}

          {/* Các trường khác */}
          <div className="mb-4">
            <textarea
              value={form.description || ""}
              placeholder="Description"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field w-full p-2 border rounded h-24"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Title*"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <input
              type="Stock "
              placeholder="Product Name *"
              value={form.stock || ""}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input-field w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div className="mb-4">
            <input
              type="number"
              placeholder="Price *"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-field w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={form.category_id || ""}
              placeholder="Product Name *"
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="input-field w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
          >
            {isEditing ? "Update Product" : "Create Product"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
