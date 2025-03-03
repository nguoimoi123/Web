// src/app/image/image.jsx

// Khai báo đối tượng chứa các hình ảnh
const images = {};

// Sử dụng require.context để import tất cả các hình ảnh từ thư mục hiện tại
const context = require.context('./', false, /\.(png|jpe?g|svg)$/);

// Duyệt qua tất cả các file hình ảnh và thêm chúng vào đối tượng images
context.keys().forEach((key) => {
  const imageName = key.replace('./', '').replace(/\.(png|jpe?g|svg)$/, '');
  images[imageName] = context(key); // Lưu đường dẫn hình ảnh vào đối tượng images
});

export default images;
