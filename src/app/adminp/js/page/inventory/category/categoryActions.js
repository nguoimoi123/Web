// export const fetchCategories = async () => {
//   try {
//     const response = await fetch("http://192.168.1.44:3000/api/inventory/category");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw new Error("Unable to fetch categories");
//   }
// };

// export const addCategory = async (categoryData) => {
//   try {
//     const response = await fetch("http://192.168.1.44:3000/api/inventory/category", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(categoryData),
//     });

//     // Kiểm tra xem phản hồi có dữ liệu hay không
//     if (!response.ok) {
//       console.error("API error: ", response.statusText);
//       throw new Error("Error adding category");
//     }

//     // Kiểm tra xem phản hồi có rỗng không
//     const responseText = await response.text(); // Đọc phản hồi dưới dạng văn bản
//     const data = responseText ? JSON.parse(responseText) : {}; // Parse JSON nếu có dữ liệu, nếu không trả về đối tượng rỗng

//     return data;
//   } catch (error) {
//     console.error("Error adding category:", error);  // Log lỗi chi tiết
//     throw new Error("Error adding category");
//   }
// };



// export const updateCategory = async (category_id, categoryData) => {
//   try {
//     const response = await fetch(`http://192.168.1.44:3000/api/inventory/category/${category_id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(categoryData),
//     });
//     if (!response.ok) throw new Error("Error updating category");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw new Error("Error updating category");
//   }
// };


// export const deleteCategory = async (category_id) => {  // Sửa categoryId thành category_id
//   try {
//     const response = await fetch(`http://192.168.1.44:3000/api/inventory/category/${category_id}`, {
//       method: "DELETE",
//     });
//     if (!response.ok) throw new Error("Error deleting category");
//     return true;
//   } catch (error) {
//     throw new Error("Error deleting category");
//   }
// };

