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
  export const addProduct = async (productData) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!productData.product_name || !productData.img_url || !productData.description || !productData.price || !productData.category_id || !productData.stock || !productData.title) {
        throw new Error("Missing required fields");
      }
  
      const response = await fetch("http://localhost:3000/api/inventory/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        console.error("API error: ", response.statusText);
        throw new Error("Error adding product");
      }
  
      const responseText = await response.text(); // Đọc phản hồi dưới dạng văn bản
      const data = responseText ? JSON.parse(responseText) : {}; // Parse JSON nếu có dữ liệu, nếu không trả về đối tượng rỗng
  
      return data;
    } catch (error) {
      console.error("Error adding product:", error);  // Log lỗi chi tiết
      throw new Error("Error adding product");
    }
  };
  
  
  // Cập nhật thông tin sản phẩm
  // export const updateProduct = async (product_id, productData) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/inventory/product/${product_id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(productData),
  //     });
      
  //     if (!response.ok) throw new Error("Error updating product");
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw new Error("Error updating product");
  //   }
  // };
  
  // Xóa sản phẩm
  // export const deleteProduct = async (product_id) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/inventory/product/${product_id}`, {
  //       method: "DELETE",
  //     });
      
  //     if (!response.ok) throw new Error("Error deleting product");
  //     return true;
  //   } catch (error) {
  //     throw new Error("Error deleting product");
  //   }
  // };
  
    
    