// Fetch tất cả sản phẩm
export const fetchProducts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/inventory/product");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Unable to fetch products");
  }
};

// Thêm sản phẩm mới
export const addProduct = async (productData, imageFile) => {
  try {
    // Kiểm tra các trường bắt buộc trong productData
    if (!productData.product_name || !productData.price || !productData.category_id || !productData.stock || !productData.title) {
      throw new Error("Missing required fields");
    }

    // Tạo đối tượng FormData để gửi dữ liệu
    const formData = new FormData();

    // Thêm các trường dữ liệu sản phẩm vào FormData
    formData.append("product_name", productData.product_name);
    formData.append("price", productData.price);
    formData.append("category_id", productData.category_id);
    formData.append("stock", productData.stock);
    formData.append("title", productData.title);
    formData.append("description", productData.description || ""); // Nếu có mô tả sản phẩm, nếu không thì gửi chuỗi rỗng

    // Thêm ảnh nếu có
    if (imageFile) {
      formData.append("image", imageFile); // Trường 'image' sẽ chứa file ảnh
    }

    // Gửi yêu cầu POST đến API backend
    const response = await fetch("http://localhost:3000/api/inventory/product", {
      method: "POST",
      body: formData,
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error("Error adding product");
    }

    // Nhận dữ liệu trả về từ server
    const data = await response.json();

    // Trả về dữ liệu nếu thành công
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Error adding product");
  }
};




// Cập nhật sản phẩm
export const updateProduct = async (product_id, productData, imageFile) => {
  try {
    const formData = new FormData();

    // Thêm dữ liệu sản phẩm vào FormData
    formData.append("product_name", productData.product_name);
    formData.append("price", productData.price);
    formData.append("category_id", productData.category_id);
    formData.append("stock", productData.stock);
    formData.append("title", productData.title);

    // Thêm ảnh mới nếu có
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`http://localhost:3000/api/inventory/product/${product_id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error updating product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
};



// Xóa sản phẩm
export const deleteProduct = async (productId) => {
  const response = await fetch(`/api/inventory/product/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product.");
  }

  const data = await response.json();
  return data;
};

