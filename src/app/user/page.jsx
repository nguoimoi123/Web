'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import  Carousel  from '../Components/Carousel'
import Link from 'next/link';
import Nav from "./include/nav";
import { Footers } from "../Components/Footer";
import Search from "../Components/Search";


// API URL
const API_URL1 = "http://localhost:3000/api/inventory/product";
const API_URL2 = "http://localhost:3000/api/ucart";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Products
  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/inventory/product');
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }
      const data = await response.json();
  
      // Sắp xếp sản phẩm theo ngày tạo mới nhất (giả sử có trường `created_at`)
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      // Chỉ lấy 4 sản phẩm mới nhất
      const latestProducts = sortedData.slice(0, 4);
  
      // Cập nhật URL ảnh
      const updatedData = latestProducts.map((product) => ({
        ...product,
        img_url: product.img_url ? `${product.img_url}` : '/image.jpg',
      }));
  
      setProducts(updatedData);
    } catch (error) {
      setError('Unable to load products.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/inventory/category");
      if (!response.ok) {
        throw new Error("Failed to load categories.");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError("Unable to load categories.");
      console.error("Error fetching categories:", error);
    }
  }
  // Fetch products and categories on mount
  useEffect(() => {
    fetchCategories();
    fetchProductsData();
  }, []);

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
  
  const images = [
    "/image/anh1.jpg",
    "/image/anh2.jpg",
    "/image/anh3.jpg",
    "/banner.jpg",
  ];
  const banners = [
    "/banner.jpg",
    "/banner.jpg",
    "/banner.jpg",
  ];
  return (

    <main> 
        <Nav/>
       <div className="App flex">
      <Carousel images={images} />
      <div className="flex flex-col ml-1 " style={{ height: "100%" ,width: "18.5rem", margin:"60px 10px"}}>
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index}`}
            className="flex-grow rounded-2xl shadow-lg mb-4 last:mb-0 m-4"
          />
        ))}
      </div>
    </div>
      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">Sản phẩm hot nhất</h1>
        {loading && <div className="text-center text-blue-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        <div className="mb-4 flex justify-between items-center">
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
  {products.map((product) => (
   <Link key={product.product_id} href={`/user/product/${product.product_id}`}>
      <div className="border rounded-lg p-4 shadow-lg cursor-pointer">
        <h2 className="text-xl font-semibold">{product.product_name}</h2>
        <Image
          src={product.img_url || "/image.jpg"}
          alt={product.product_name}
          width={800}
          height={800}
          className="object-cover rounded mb-4"
          style={{ height: "230px" }}
        />
        <p>Price: {product.price}</p>
        <div className="flex justify-around space-x-2 mt-4">
          <button
            onClick={(e) => {
              e.preventDefault(); 
              handleAddToCart(product);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>
      </div>
      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">Sản phẩm oganic</h1>
        {loading && <div className="text-center text-blue-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        <div className="mb-4 flex justify-between items-center">
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
  {products.map((product) => (
   <Link key={product.product_id} href={`/user/product/${product.product_id}`}>
      <div className="border rounded-lg p-4 shadow-lg cursor-pointer">
        <h2 className="text-xl font-semibold">{product.product_name}</h2>
        <Image
          src={product.img_url || "/image.jpg"}
          alt={product.product_name}
          width={800}
          height={800}
          className="object-cover rounded mb-4"
          style={{ height: "230px" }}
        />
        <p>Price: {product.price}</p>
        <div className="flex justify-around space-x-2 mt-4">
          <button
            onClick={(e) => {
              e.preventDefault(); // Ngăn chuyển hướng khi nhấn nút "Thêm giỏ hàng"
              handleAddToCart(product);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>
      </div>
      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">Sản phẩm bán chạy nhất</h1>
        {loading && <div className="text-center text-blue-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        <div className="mb-4 flex justify-between items-center">
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
  {products.map((product) => (
   <Link key={product.product_id} href={`/user/product/${product.product_id}`}>
      <div className="border rounded-lg p-4 shadow-lg cursor-pointer">
        <h2 className="text-xl font-semibold">{product.product_name}</h2>
        <Image
                          src={product.img_url || '/image.jpg'}
                          alt={product.product_name}
                          width={800}
                          height={800}
                          className="object-cover rounded mb-4"
                          style={{ height: "230px" }}
                        />
        <p>Price: {product.price}</p>
        <div className="flex justify-around space-x-2 mt-4">
          <button
            onClick={(e) => {
              e.preventDefault(); // Ngăn chuyển hướng khi nhấn nút "Thêm giỏ hàng"
              handleAddToCart(product);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>
      </div>  
      <Footers/>
    </main>
  );
}


