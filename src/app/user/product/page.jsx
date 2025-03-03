'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../include/nav";
import { Footers } from "../../Components/Footer";
import Search from "../../Components/Search";
import Pagination from "../../Components/Pagination";

export default function ProductsPage() {
  const API_URL2 = "http://localhost:3000/api/ucart";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const [searchActive, setSearchActive] = useState(false); // Trạng thái tìm kiếm

  // Fetch Products
  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/inventory/product");
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data = await response.json();

      const updatedData = data.map((product) => ({
        ...product,
        img_url: product.img_url ? `${product.img_url}` : "/image.jpg",
      }));

      setProducts(updatedData);
    } catch (error) {
      setError("Unable to load products.");
      console.error("Error fetching products:", error);
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
  };

  useEffect(() => {
    fetchCategories();
    fetchProductsData();
  }, []);

  // Lọc sản phẩm theo danh mục
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === parseInt(selectedCategory))
    : products;

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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

  const handleSearch = (isActive) => {
    setSearchActive(isActive);
  };

  return (
    <main>
      <Nav />
      <Search onSearch={handleSearch} />
      {!searchActive && (
      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">All Products</h1>
        {loading && <div className="text-center text-blue-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        <div className="mb-4 flex justify-between items-center">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mb-4 p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {currentProducts.length === 0 ? (
          <div className="text-center text-gray-600 mt-6">No products available. Please add one!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {currentProducts.map((product) => (
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
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      )}
      <Footers />
    </main>
  );
}
