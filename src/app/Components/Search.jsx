import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Vui lòng nhập tên sản phẩm để tìm kiếm.");
      return;
    }

    try {
      const response = await fetch(`/api/inventory/products/${encodeURIComponent(query)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Không tìm thấy sản phẩm.");
        }
        throw new Error("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
      onSearch(true); // Thông báo tìm kiếm thành công
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      setError(error.message || "Không thể tìm kiếm sản phẩm.");
      onSearch(false); // Thông báo tìm kiếm thất bại
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex items-center gap-4 p-4 "  style={{ margin: "0 450px " }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;