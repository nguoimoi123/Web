'use client';

import { useEffect, useState } from 'react';
import { IoNotifications, IoVolumeHigh, IoAddOutline } from "react-icons/io5";
import { MdMoreVert, MdEdit } from "react-icons/md";
import Image from 'next/image';
import Click from './mode';

const Control = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Lấy email từ localStorage
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setUserEmail(storedEmail); // Lưu email vào state
    }
  }, []);

  return (
    <div className="right-section">
      <div className="nav">
        <Click />
        <div className="profile">
          <div className="info">
            <p> <b>{userEmail || "Guest"}</b></p>
            <small className="text-muted"></small>
          </div>
        </div>
      </div>
      <div className="user-profile">
        <div className="logo">
         <Image
            src="/logo.jpg"
            alt= "logo"
            width={500}
            height={500}
            className="object-cover rounded mb-4"
          />
          <h2>MinhQuanProg</h2>
          <p>Express</p>
        </div>
      </div>
    </div>
  );
};

export default Control;
