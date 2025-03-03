'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FaRegUser, FaShippingFast, FaInbox 
} from "react-icons/fa";
import { 
  MdDashboard, MdOutlineReceiptLong, MdInventory, 
  MdOutlineReportGmailerrorred, MdOutlineCategory 
} from "react-icons/md";
import { 
  IoClose, IoMailOutline, IoSettings, IoAdd, IoLogOutOutline 
} from "react-icons/io5";
import "./../../css/sidebar.css";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSaleListExpanded, setIsSaleListExpanded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));

    if (token && storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
    }
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
    router.push(`/adminp?page=${item}`);
  };

  const handleSaleListToggle = () => {
    setIsSaleListExpanded(!isSaleListExpanded);
  };

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserEmail(''); 
    router.push('/login');
  };

  return (
    <aside>
      <div className="toggle">
        <div className="logo">
          <h2>MinhQuan<span className="danger">Prog</span></h2>
        </div>
        <div className="close" id="close-btn">
          <span><IoClose /></span>
        </div>
      </div>
      <div className="sidebar">
        <a
          href="#"
          className={activeItem === "dashboard" ? "active" : ""}
          onClick={() => handleItemClick("dashboard")}
        >
          <span><MdDashboard /></span>
          <h3>Dashboard</h3>
        </a>
        {isLoggedIn && (
          <>
            <a
              className={activeItem === "users" ? "active" : ""}
              onClick={() => handleItemClick("users")}
            >
              <span><FaRegUser /></span>
              <h3>Users</h3>
            </a>
            <a
              href="#"
              className={activeItem === "history" ? "active" : ""}
              onClick={() => handleItemClick("history")}
            >
              <span><MdOutlineReceiptLong /></span>
              <h3>History</h3>
            </a>
            <a
              className={activeItem === "saleList" ? "active" : ""}
              onClick={() => handleItemClick("product")}
            >
              <span><MdInventory /></span>
              <h3>Inventory</h3>
            </a>
            <a
              href="#"
              className={activeItem === "shipping" ? "active" : ""}
              onClick={() => handleItemClick("shipping")}
            >
              <span><FaShippingFast /></span>
              <h3>Shipping</h3>
            </a>
            <a
              href="#"
              className={activeItem === "tickets" ? "active" : ""}
              onClick={() => handleItemClick("tickets")}
            >
              <span><IoMailOutline /></span>
              <h3>Tickets</h3>
              <span className="message-count">21</span>
            </a>
            <a
              href="#"
              className={activeItem === "report" ? "active" : ""}
              onClick={() => handleItemClick("report")}
            >
              <span><MdOutlineReportGmailerrorred /></span>
              <h3>Report</h3>
            </a>
            <a
              href="#"
              className={activeItem === "setting" ? "active" : ""}
              onClick={() => handleItemClick("setting")}
            >
              <span><IoSettings /></span>
              <h3>Setting</h3>
            </a>
            <a
              href="#"
              className={activeItem === "logout" ? "active" : ""}
              onClick={handleLogout}
            >
              <span><IoLogOutOutline /></span>
              <h3>Logout</h3>
            </a>
          </>
        )}
        {!isLoggedIn && (
          <a
            href="#"
            className={activeItem === "newLogin" ? "active" : ""}
            onClick={() => handleItemClick("newLogin")}
          >
            <span><IoAdd /></span>
            <h3>New Login</h3>
          </a>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
