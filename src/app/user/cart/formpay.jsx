import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function PaymentForm({ onClose, onSubmit, productDetails, totalPrice }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [payment, setPayment] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));
  const [idShipping, setIdShipping] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchShippingData(userId);
    }
  }, [userId]);

  const fetchShippingData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/shipping/${userId}`);
      if (!response.ok) throw new Error('Không thể tải thông tin giao hàng');
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        const shipping = data[0];
        setName(shipping.name || '');
        setPhone(shipping.phone || '');
        setAddress(shipping.address || '');
        setNote(shipping.note || '');
        setIdShipping(shipping.id_shipping);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giao hàng:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/shipping/${userId}`);
      const existingData = await response.json();
      let id_shipping;

      if (existingData && existingData.length > 0) {
        id_shipping = await updateShippingInfo();
      } else {
        id_shipping = await createShippingInfo();
      }

      setIdShipping(id_shipping);
      return id_shipping;
    } catch (error) {
      console.error('Lỗi khi gửi thông tin giao hàng:', error);
    }
  };

  const updateShippingInfo = async () => {
    const response = await fetch(`/api/shipping/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address, note }),
    });

    if (!response.ok) throw new Error('Lỗi khi cập nhật thông tin giao hàng');

    const result = await response.json();
    return result.id_shipping;
  };

  const createShippingInfo = async () => {
    const response = await fetch(`/api/shipping/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address, note }),
    });

    if (!response.ok) throw new Error('Lỗi khi tạo mới thông tin giao hàng');

    const result = await response.json();
    return result.id_shipping;
  };

  const handleSubmit2 = async () => {
    if (!idShipping) throw new Error('Chưa có thông tin giao hàng!');

    const response = await fetch(`/api/acart/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: 'pending', payment, id_shipping: idShipping }),
    });

    if (!response.ok) throw new Error('Lỗi khi tạo giỏ hàng');

    const result = await response.json();
    return result.cart_id;
  };

  const handleSubmit3 = async (cartId) => {
    if (!productDetails || !Array.isArray(productDetails) || productDetails.length === 0 || !cartId) {
      throw new Error('Thiếu productDetails hoặc cartId!');
    }

    for (const product of productDetails) {
      const { product_id, quantity } = product;

      const response = await fetch(`/api/detail/${cartId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, quantity }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi thêm chi tiết đơn hàng cho product_id ${product_id}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/4">
        <h2 className="text-xl font-bold mb-4">Thanh toán</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await handleSubmit();
              const cartId = await handleSubmit2();
              if (cartId) await handleSubmit3(cartId);
              alert('Thanh toán thành công!');
              onClose();
            } catch (error) {
              console.error('Lỗi khi thanh toán:', error);
              alert('Đã xảy ra lỗi trong quá trình thanh toán.');
            }
          }}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên đầy đủ</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="payment" className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
            <select
              id="payment"
              value={payment}
              onChange={(e) => {
                setPayment(e.target.value);
                setShowQR(e.target.value === 'qr_payment');
              }}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Chọn phương thức thanh toán</option>
              <option value="cash_on_delivery">Thanh toán khi nhận hàng</option>
              <option value="qr_payment">QR Code</option>
            </select>
          </div>
          {showQR && (
            <div className="mt-4 text-center">
              <p className="mb-2 text-gray-700">Quét mã QR để thanh toán:</p>
              <QRCode value={`Payment Amount: ${totalPrice}`} size={150} />
            </div>
          )}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300"
            >
              Thanh toán
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}