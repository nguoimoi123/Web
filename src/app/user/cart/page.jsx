'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from './formpay';
import { Tabs } from "flowbite-react";
import { Table } from "flowbite-react";
import Nav from '../include/nav';
import { Footers } from "../../Components/Footer";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0); // Tổng giá giỏ hàng
  const [shippingData, setShippingData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Lấy user_id từ localStorage
    const user_id = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    console.log(user_id);
    console.log(role);
    if (role== 0) {
      setIsAuthenticated(true);
      fetchCartData(user_id); // Gọi API để lấy giỏ hàng của người dùng
    }
    const fetchShippingData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/acart");
        const data = await response.json();
        setShippingData(data); // Lưu danh sách dữ liệu giao hàng
      } catch (error) {
        console.error("Lỗi khi lấy thông tin giao hàng:", error);
      }
    };
    fetchShippingData();
  }, []);

  // Hàm gọi API để lấy giỏ hàng từ server
  const fetchCartData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/ucart/${userId}`);
      if (!response.ok) {
        throw new Error('Không thể tải giỏ hàng');
      }
      const data = await response.json();
      setCart(data); // Cập nhật giỏ hàng
      calculateTotalPrice(data); // Tính tổng giá giỏ hàng
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      alert('Có lỗi xảy ra khi lấy giỏ hàng');
    }
  };

  const handleLoginRedirect = () => {
    localStorage.setItem('pendingCart', JSON.stringify(cart));
    router.push('/login?redirect=/cart');
  };

 // Tính tổng giá của giỏ hàng
 const calculateTotalPrice = (cartItems) => {
  const total = cartItems.reduce((sum, data) => sum + data.price * data.quantity, 0);
  setTotalPrice(total);
};

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (productId, change) => {
    if (!isAuthenticated) return;

    // Cập nhật số lượng sản phẩm ở giỏ hàng ngay lập tức
    const updatedCart = cart.map((data) => {
      if (data.product_id === productId) {
        const newQuantity = data.quantity + change;
        if (newQuantity > 0) {
          return { ...data, quantity: newQuantity };
        }
      }
      return data;
    });
    
    setCart(updatedCart); // Cập nhật giỏ hàng trong UI ngay lập tức

    // Gửi yêu cầu PUT để cập nhật số lượng
    const response = await fetch(`http://localhost:3000/api/ucart/${cart[0]?.user?.id}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: updatedCart.find(data => data.product_id === productId).quantity }),
    });

    if (!response.ok) {
      alert('Không thể cập nhật số lượng sản phẩm');
    }
    setCart(updatedCart);
    calculateTotalPrice(updatedCart); // Cập nhật lại tổng giá sau khi thay đổi số lượng
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (product_id) => {
    const updatedCart = cart.filter((data) => data.product_id !== product_id);
    const userId = cart[0]?.user?.id;

    setCart(updatedCart); // Cập nhật giỏ hàng trong UI ngay lập tức
    
    // Gửi yêu cầu DELETE để xóa sản phẩm
    const response = await fetch(`http://localhost:3000/api/ucart/${userId}/${product_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      alert('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
    calculateTotalPrice(updatedCart); // Cập nhật lại tổng giá sau khi xóa sản phẩm
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  const removeAllFromCart = async () => {
    const userId = cart[0]?.user?.id;

    if (userId) {
      const response = await fetch(`http://localhost:3000/api/ucart/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCart([]); // Xóa giỏ hàng trong UI ngay lập tức
        localStorage.setItem('cart', JSON.stringify([])); // Xóa giỏ hàng trong localStorage
      } else {
        alert('Không thể xóa tất cả sản phẩm');
      }
    }
    setTotalPrice(0); // Đặt lại tổng giá giỏ hàng về 0
    localStorage.setItem('cart', JSON.stringify([])); // Lưu giỏ hàng trống vào localStorage
  };

 const handleOpenPayment = () => {
    const productDetails = cart.map(data => ({
      product_id: data.product_id,
      quantity: data.quantity,
    }));
    setShowPaymentModal(true);;
  };

  const handleClosePayment = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentSubmit = (paymentData) => {
    console.log('Thanh toán thành công với dữ liệu:', paymentData);
  };
  const handleStateChange = async (cartId, newState) => {
    try {
      const response = await fetch(`http://localhost:3000/api/acarts/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: newState }),
      });
  
      if (response.ok) {
        setShippingData((prevData) =>
          prevData.map((item) =>
            item.cart_id === cartId ? { ...item, state: newState } : item
          )
        );
      } else {
        alert("Không thể cập nhật trạng thái đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi kết nối khi cập nhật trạng thái:", error);
    }
  };
  
  return (
    <div
      className="flex flex-col min-h-screen" // Tạo layout chính với Flexbox
    >
    <main className='flex-1'>
      <Nav/>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🛒 Giỏ hàng</h1>
      {!isAuthenticated && (
        <>
        <div className="auth-required-message bg-yellow-100 p-4 rounded-lg mb-6">
          <p className="text-yellow-800 mb-4">Vui lòng đăng nhập để tiếp tục với giỏ hàng của bạn</p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Đăng nhập ngay
          </button>
        </div>
        </>
      )}

      {isAuthenticated && (
        <>
        <Tabs aria-label="Default tabs" variant="default">
      <Tabs.Item title="Giỏ hàng" >
      {cart.length === 0 ? (
            <p className="text-gray-600">Giỏ hàng trống</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cart.map((product, index) => (
                <div key={`${product.product_id}-${index}`} className="border rounded-lg p-4 shadow-lg">
                  <h2 className="text-xl font-semibold">{product.product_name}</h2>
                  <img src={product.img_url} alt={product.product_name} className="w-full h-40 object-cover rounded mb-4" />
                  <p>Giá: {product.price} VNĐ</p>
                  <p>Số lượng: {product.quantity}</p>
                  <p>Thành tiền: {product.price * product.quantity} VNĐ</p> {/* Hiển thị giá theo số lượng */}
                  <div className="flex datas-center space-x-4 mt-2">
                    <button onClick={() => updateQuantity(product.product_id, -1)} className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400">➖</button>
                    <span className="text-lg">{product.quantity}</span>
                    <button onClick={() => updateQuantity(product.product_id, 1)} className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400">➕</button>
                  </div>
                  <button onClick={() => removeFromCart(product.product_id)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Xoá</button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <p className="font-semibold text-lg">Tổng giá: {totalPrice} VNĐ</p> {/* Hiển thị tổng giá giỏ hàng */}
          </div>
         
          <button onClick={removeAllFromCart} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4">Xoá Tất Cả</button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300" onClick={handleOpenPayment} disabled={!isAuthenticated || cart.length === 0}>Thanh toán</button>
      </Tabs.Item>
      <Tabs.Item title="Đã đặt hàng">
      {shippingData.filter((data) => data.state === 0).length > 0 ? (
        <Table>
      <Table.Head>
        <Table.HeadCell>Tên người nhận</Table.HeadCell>
        <Table.HeadCell>Địa chỉ</Table.HeadCell>
        <Table.HeadCell>Số điện thoại</Table.HeadCell>
        <Table.HeadCell>Phương thức thanh toán</Table.HeadCell>
        <Table.HeadCell>Hành động</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {shippingData
          .filter((data) => data.state === 0)
          .map((data) => (
            <Table.Row key={data.cart_id}>
              <Table.Cell>{data.shipping.name}</Table.Cell>
              <Table.Cell>{data.shipping.address}</Table.Cell>
              <Table.Cell>{data.shipping.phone}</Table.Cell>
              <Table.Cell>{data.payment}</Table.Cell>
              <Table.Cell>
                <button
                  onClick={() => handleStateChange(data.cart_id, 4)} // Chuyển trạng thái thành 4 (Đã hủy)
                  className="text-red-600 hover:underline"
                >
                  Hủy đơn
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  ) : (
    <p className="text-gray-600">Không có dữ liệu giao hàng.</p>
  )}
      </Tabs.Item>
      <Tabs.Item title="Vận chuyển" >
        {shippingData.filter((data) => data.state === 1).length > 0 ? (
      <Table>
        <Table.Head>
          
          <Table.HeadCell>Tên người nhận</Table.HeadCell>
          <Table.HeadCell>Địa chỉ</Table.HeadCell>
          <Table.HeadCell>Số điện thoại</Table.HeadCell>
          <Table.HeadCell>Phương thức thanh toán</Table.HeadCell>
        </Table.Head>
        <Table.Body>
        {shippingData
            .filter((data) => data.state === 1)
            .map((data) => (
            <Table.Row key={data.cart_id}>
              <Table.Cell>{data.shipping.name}</Table.Cell>
              <Table.Cell>{data.shipping.address}</Table.Cell>
              <Table.Cell>{data.shipping.phone}</Table.Cell>
              <Table.Cell>{data.payment}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    ) : (
      <p className="text-gray-600">Không có dữ liệu giao hàng.</p>
    )}
          
      </Tabs.Item>
      <Tabs.Item title="Chờ giao hàng" >
      {shippingData.filter((data) => data.state === 2).length > 0 ? (
    <Table>
      <Table.Head>
        
        <Table.HeadCell>Tên người nhận</Table.HeadCell>
        <Table.HeadCell>Địa chỉ</Table.HeadCell>
        <Table.HeadCell>Số điện thoại</Table.HeadCell>
        <Table.HeadCell>Phương thức thanh toán</Table.HeadCell>
      </Table.Head>
      <Table.Body>
      {shippingData
          .filter((data) => data.state === 2)
          .map((data) => (
          <Table.Row key={data.cart_id}>
            <Table.Cell>{data.shipping.name}</Table.Cell>
            <Table.Cell>{data.shipping.address}</Table.Cell>
            <Table.Cell>{data.shipping.phone}</Table.Cell>
            <Table.Cell>{data.payment}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ) : (
    <p className="text-gray-600">Không có dữ liệu giao hàng.</p>
  )}
        
      </Tabs.Item>
      <Tabs.Item title="Đã giao hàng" >
      {shippingData.filter((data) => data.state === 3).length > 0 ? (
    <Table>
      <Table.Head>
        <Table.HeadCell>Tên người nhận</Table.HeadCell>
        <Table.HeadCell>Địa chỉ</Table.HeadCell>
        <Table.HeadCell>Số điện thoại</Table.HeadCell>
        <Table.HeadCell>Phương thức thanh toán</Table.HeadCell>
      </Table.Head>
      <Table.Body>
      {shippingData
          .filter((data) => data.state === 3)
          .map((data) => (
          <Table.Row key={data.cart_id}>
            <Table.Cell>{data.shipping.name}</Table.Cell>
            <Table.Cell>{data.shipping.address}</Table.Cell>
            <Table.Cell>{data.shipping.phone}</Table.Cell>
            <Table.Cell>{data.payment}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ) : (
    <p className="text-gray-600">Không có dữ liệu giao hàng.</p>
  )}
        
      </Tabs.Item>
      <Tabs.Item title="Đã hủy" >
      {shippingData.filter((data) => data.state === 4).length > 0 ? (
    <Table>
      <Table.Head>
        
        <Table.HeadCell>Tên người nhận</Table.HeadCell>
        <Table.HeadCell>Địa chỉ</Table.HeadCell>
        <Table.HeadCell>Số điện thoại</Table.HeadCell>
        <Table.HeadCell>Phương thức thanh toán</Table.HeadCell>
      </Table.Head>
      <Table.Body>
      {shippingData
          .filter((data) => data.state === 4)
          .map((data) => (
          <Table.Row key={data.cart_id}>
            <Table.Cell>{data.shipping.name}</Table.Cell>
            <Table.Cell>{data.shipping.address}</Table.Cell>
            <Table.Cell>{data.shipping.phone}</Table.Cell>
            <Table.Cell>{data.payment}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ) : (
    <p className="text-gray-600">Không có dữ liệu giao hàng.</p>
  )}
    
      </Tabs.Item>
    </Tabs>

        </>
      )}
      {showPaymentModal && <PaymentForm 
      onClose={handleClosePayment} 
      onSubmit={handlePaymentSubmit} 
      productDetails={cart}
      totalPrice={totalPrice}
      />}
       
    </main>
    <Footers/>
   </div>
  );

}
