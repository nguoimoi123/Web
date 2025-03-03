import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import DetailCart from "./cart_detail"; // Import modal component
import Pagination from "../../../../Components/Pagination";

export default function Shipping() {
  const [shippingData, setShippingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ShippingPerPage = 5; // Hiển thị 5 dòng mỗi trang

  const totalPages = Math.ceil(shippingData.length / ShippingPerPage);
  const indexOfLastItem = currentPage * ShippingPerPage;
  const indexOfFirstItem = indexOfLastItem - ShippingPerPage;
  const currentItems = shippingData.slice(indexOfFirstItem, indexOfLastItem);

  const fetchShippingData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/acart");
      const data = await response.json();
      setShippingData(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin giao hàng:", error);
    }
  };

  const handleStateChange = async (cartId, currentState) => {
    const nextState = (currentState + 1) % 5; // Chuyển sang trạng thái tiếp theo (0 -> 4)
    try {
      const response = await fetch(`http://localhost:3000/api/acarts/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: nextState }),
      });

      if (response.ok) {
        setShippingData((prevData) =>
          prevData.map((item) =>
            item.cart_id === cartId ? { ...item, state: nextState } : item
          )
        );
      }
    } catch (error) {
      console.error("Lỗi kết nối khi cập nhật trạng thái:", error);
    }
  };

  const getStateButtonColor = (state) => {
    const colorMap = {
      0: "bg-gray-200 text-gray-800",
      1: "bg-blue-200 text-blue-800",
      2: "bg-yellow-200 text-yellow-800",
      3: "bg-green-200 text-green-800",
      4: "bg-red-200 text-red-800",
    };
    return colorMap[state] || "bg-gray-200 text-gray-800";
  };

  const handleViewDetail = (cartId) => {
    setSelectedCartId(cartId); // Lưu cartId được chọn
    setIsModalOpen(true); // Mở modal
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Thông tin giao hàng</h1>
      <Table>
        <Table.Head>
          <Table.HeadCell>Mã giỏ hàng</Table.HeadCell>
          <Table.HeadCell>Phương thức thanh toán</Table.HeadCell>
          <Table.HeadCell>Tên người nhận</Table.HeadCell>
          <Table.HeadCell>Địa chỉ giao hàng</Table.HeadCell>
          <Table.HeadCell>Số điện thoại</Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
          <Table.HeadCell>Chi tiết</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <Table.Row key={item.cart_id}>
                <Table.Cell>{item.cart_code}</Table.Cell>
                <Table.Cell>{item.payment}</Table.Cell>
                <Table.Cell>{item.shipping.name}</Table.Cell>
                <Table.Cell>{item.shipping.address}</Table.Cell>
                <Table.Cell>{item.shipping.phone}</Table.Cell>
                <Table.Cell>
                  <button
                    onClick={() => handleStateChange(item.cart_id, item.state)}
                    className={`px-4 py-2 rounded ${getStateButtonColor(
                      item.state
                    )}`}
                  >
                    {item.state === 0
                      ? "Đơn hàng mới"
                      : item.state === 1
                      ? "Vận chuyển"
                      : item.state === 2
                      ? "Chờ giao hàng"
                      : item.state === 3
                      ? "Hoàn thành"
                      : "Đã hủy"}
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <button
                    onClick={() => handleViewDetail(item.cart_id)}
                    className="text-blue-600 hover:underline"
                  >
                    Xem chi tiết
                  </button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="7" className="text-center py-4">
                Không có dữ liệu giao hàng.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {/* Modal Chi Tiết Giỏ Hàng */}
      <DetailCart
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cartId={selectedCartId}
      />
    </main>
  );
}
