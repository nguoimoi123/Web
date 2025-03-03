'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ProductCard = ({ productId, imgUrl, name, rating, price }) => {
  return (
    <Link href={`/user/product/${productId}`} passHref>
      <div className="border p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer hover:shadow-lg transition">
        <img
          src={imgUrl}
          alt={name}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-gray-800">{name}</h2>
          <div className="flex items-center space-x-1 text-yellow-500">
            {Array.from({ length: rating }).map((_, index) => (
              <span key={index}>&#9733;</span>
            ))}
          </div>
          <p className="text-orange-500 font-bold">{price}</p>
        </div>
      </div>
    </Link>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProductsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/inventory/product');
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }
      const data = await response.json();

      // Sort products by created_at and select 4 newest products
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const latestProducts = sortedData.slice(0, 4);

      // Update product data with default image if missing
      const updatedData = latestProducts.map((product) => ({
        ...product,
        img_url: product.img_url || '/image.jpg',
        rating: product.rating || 5, // Default rating if API does not provide
      }));

      setProducts(updatedData);
    } catch (error) {
      setError('Unable to load products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Sản phẩm bán chạy</h1>
      {loading && (
        <div className="text-center text-blue-600">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-600">
          {error}
          <button
            onClick={fetchProductsData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
          >
            Thử lại
          </button>
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="text-center text-gray-600">No products available.</div>
      )}
      <div className="space-y-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.product_id || index}
            productId={product.product_id}
            imgUrl={product.img_url}
            name={product.product_name}
            rating={product.rating}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
