import React, { useState, useEffect } from 'react';

export default function DetailCart({ isOpen, onClose, cartId }) {
  const [cartDetail, setCartDetail] = useState(null);

  useEffect(() => {
    if (isOpen && cartId) {
      const fetchCartDetail = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/detail/${cartId}`);
          if (!response.ok) {
            throw new Error('Không thể tải thông tin chi tiết giỏ hàng');
          }
          const data = await response.json();
          setCartDetail(data); // Lưu chi tiết giỏ hàng vào state
        } catch (error) {
          console.error('Lỗi khi lấy thông tin chi tiết giỏ hàng:', error);
        }
      };

      fetchCartDetail();
    }
  }, [isOpen, cartId]);

  if (!isOpen || !cartDetail) return null; // Không render nếu modal không mở hoặc dữ liệu chưa có

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose} // Đóng modal khi nhấn nền
      ></div>

      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/4">
        <h2 className="text-xl font-bold mb-4">Chi Tiết Giỏ Hàng</h2>
        <div>
          <h3>Mã Giỏ Hàng: {cartDetail.cart_code}</h3>
          <h4>Chi Tiết Sản Phẩm</h4>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Sản phẩm</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className="px-4 py-2">Tổng giá</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cartDetail.items) && cartDetail.items.length > 0 ? (
                cartDetail.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 text-center">{item.product_name}</td>
                    <td className="border px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border px-4 py-2 text-center">{item.total_price} đ</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-2">Không có sản phẩm trong giỏ hàng.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4">
            <strong>Tổng giá giỏ hàng: {cartDetail.totalCartPrice} đ</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
