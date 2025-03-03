'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { FaUserAlt, FaShippingFast, FaLeaf, FaUtensils, FaGift } from "react-icons/fa";
import Nav from "../../include/nav";
import { Footers } from "../../../Components/Footer";
import ProductDetailsList from "../../../Components/ProductList";

export default function ProductDetail() {
  const params = useParams(); // Sử dụng useParams để lấy dynamic params
  const id = params?.id; // Lấy `id` từ params

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const API_URL2 = "http://localhost:3000/api/ucart";
  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/inventory/product/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  const handleAddToCart = async (product) => {
    // Lấy user_id từ localStorage (hoặc cookie nếu cần)
    const user_id = localStorage.getItem('user_id'); // Hoặc bạn có thể lấy từ cookie như Cookies.get('user_id')
  
    if (!user_id) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }
  
    const { product_id } = product;
  
    try {
      const response = await fetch(API_URL2, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          product_id,
          quantity: 1, // Mặc định thêm 1 sản phẩm vào giỏ
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Đã thêm vào giỏ hàng!");
      } else {
        alert(`Lỗi: ${data.error}`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Sản phẩm không tồn tại</div>;

  return (
    <main>
      <Nav/>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-white">
      {/* Phần bên trái */}
      <div className="md:w-2/3">
       
       
        <div className="flex">
        <Image
        src={product.img_url || "/image.jpg"}
        alt={product.product_name}
        width={500}
        height={500}
        className="rounded-lg"
      />
        {/* <div className="flex gap-2 mb-4">
          <Image src="/beef-sliced.jpg" alt="Thịt thái mỏng" width={100} height={100} className="rounded-lg" />
          <Image src="/beef-grilled.jpg" alt="Thịt nướng" width={100} height={100} className="rounded-lg" />
          <Image src="/beef-hotpot.jpg" alt="Thịt lẩu" width={100} height={100} className="rounded-lg" />
          <Image src="/beef-sauce.jpg" alt="Thịt với sốt" width={100} height={100} className="rounded-lg" />
        </div> */}
        <div className="m-5">
         
        <h1 className="text-3xl font-bold text-black mb-4">
          {product?.product_name || 'Thịt bò Mỹ Black Angus (Lõi vai cao cấp) - Short Plate Beef Choice USDA'}
        </h1>
        <div className="flex items-center mb-4">
          <span className="text-orange-500">★★★★★</span>
        </div>
        <p className="text-2xl font-bold text-orange-500 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-orange-500 mb-4">Title: {product.title}</p>
        <p className="text-2xl font-bold text-orange-500 mb-4">Stock: {product.stock}</p>
        <p className="text-2xl font-bold text-orange-500 mb-4">{product?.price || '125.000'}đ/Set</p>
        <button
                     onClick={(e) => {
                       e.preventDefault(); // Ngăn chuyển hướng khi nhấn nút "Thêm giỏ hàng"
                       handleAddToCart(product);
                     }}
                     className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
                   >
                     Thêm giỏ hàng
                   </button>
        </div>
        
        </div>
        

      </div>

      {/* Phần bên phải */}
      <div className="flex-1 mt-8 md:mt-0 md:ml-8 p-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Tư vấn đặt hàng</h2>
          <div className="flex items-center mb-4">
            <FaUserAlt className="text-yellow-500 w-6 h-6 mr-2" />
            <div>
              <p className="font-bold text-lg">1900 3220</p>
              <p className="text-sm text-gray-600">08h - 20h (Từ Thứ 2 đến Chủ nhật)</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FaShippingFast className="text-yellow-500 w-6 h-6 mr-2" />
            <p className="text-gray-700">Giao hàng ngay sau 30 phút</p>
          </div>
          <div className="flex items-center mb-4">
            <FaLeaf className="text-yellow-500 w-6 h-6 mr-2" />
            <p className="text-gray-700">Tiêu chuẩn GlobalGap, Organic</p>
          </div>
          <div className="flex items-center mb-4">
            <FaUtensils className="text-yellow-500 w-6 h-6 mr-2" />
            <p className="text-gray-700">Thực phẩm được sơ chế sẵn</p>
          </div>
          <div className="flex items-center">
            <FaGift className="text-yellow-500 w-6 h-6 mr-2" />
            <p className="text-gray-700">Tích điểm 1% giá trị đơn hàng</p>
          </div>
        </div>
        <ProductDetailsList />
    </div>
    </div>
    <Footers/>
    </main>
  );
}
