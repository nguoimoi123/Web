export function ProductFormModal({
    isOpen,
    onClose,
    form,
    setForm,
    onSubmit,
    isEditing,
    categories,
  }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();  // Ngăn chặn hành động mặc định
              if (!form.product_name || !form.price) {
                alert("Product name and price are required!");
                return;
              }
              onSubmit(e); // Gọi hàm onSubmit và truyền sự kiện vào
            }}
          >
            {/* Input for Product Name */}
            <input
              type="text"
              placeholder="Product Name"
              value={form.product_name}
              onChange={(e) => setForm({ ...form, product_name: e.target.value })}
              required
              className="input-field"
            />
  
            {/* Input for Product Description */}
            <textarea
              placeholder="Product Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field mt-2"
            ></textarea>
  
            {/* Input for Product Title */}
            <input
              type="text"
              placeholder="Product Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field mt-2"
            />
  
            {/* Input for Stock */}
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input-field mt-2"
              min={0}
            />
  
            {/* Input for Image URL */}
            <input
              type="url"
              placeholder="Image URL"
              value={form.img_url}
              onChange={(e) => setForm({ ...form, img_url: e.target.value })}
              className="input-field mt-2"
            />
  
            {/* Input for Price */}
            <input
              type="text"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-field mt-2"
              min={0}
              step="0.01"
              required
            />
  
            {/* Dropdown for Category Name */}
            <select
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                value={form.category_id}
                className="mb-4 p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
  
  
            {/* Submit button */}
            <button
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded mt-4"
            >
              {isEditing ? "Save Changes" : "Add Product"}
            </button>
  
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded mt-4"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }
  