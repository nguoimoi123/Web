export function CategoryFormModal({ isOpen, onClose, form, setForm, onSubmit, isEditing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose} // Đóng modal khi người dùng click vào lớp phủ
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Category" : "Add Category"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.category_name) {
              alert("Category name is required!");
              return;
            }
            onSubmit(); // Gọi hàm submit (cập nhật hoặc thêm)
          }}
        >
          {/* Input for category name */}
          <input
            type="text"
            placeholder="Category Name"
            value={form.category_name}
            onChange={(e) => setForm({ ...form, category_name: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
              disabled={!form.category_name} // Disable button if category name is empty
            >
              {isEditing ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
