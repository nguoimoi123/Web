'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import "./css/style.css"
import Sidebar from "./js/include/sidebar";
import Tab from "./js/include/tab";
import Dashboard from './js/page/dashboard/page';
import Product from "./js/page/inventory/product/page";
import Shipping from './js/page/shipping/page';

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Sử dụng useSearchParams thay vì query
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    // Kiểm tra sự thay đổi của query params
    const page = searchParams.get("page") || "dashboard"; // Nếu không có query params thì mặc định là "dashboard"
    setCurrentPage(page);
  }, [searchParams]);

  const renderPage = () => {

    switch (currentPage) {  
      case "dashboard":
        return <Dashboard />;
      case "product":
          return <Product />;
      case "shipping":
        return <Shipping/>;    
      default:
        return <Dashboard />; 
    }
  };
  return (
      <div className="container">
        <Sidebar/>
        {renderPage()}
        <Tab/>
      </div>
  );
}

  