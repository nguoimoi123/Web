'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Nav() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [email, setEmail] = useState(''); // Email của người dùng
  const [dropdownOpen, setDropdownOpen] = useState(false); // Trạng thái mở dropdown

  // Kiểm tra trạng thái đăng nhập khi trang được tải
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));

    if (token) {
      const tokenValue = token.split('=')[1];
      try {
        const decodedToken = JSON.parse(atob(tokenValue.split('.')[1])); // Giải mã JWT token
        if (decodedToken.role === 1) {
          setIsLoggedIn(true);
          setEmail(decodedToken.email);
          router.push('/adminp'); // Chuyển hướng đến trang admin nếu là admin
        } else if (decodedToken.role === 0) {
          setIsLoggedIn(true);
          setEmail(decodedToken.email);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout(); // Nếu token không hợp lệ, thực hiện logout
      }
    }
  }, [router]);

  // Hàm đăng xuất
  const logout = () => {
    // Xóa cookie và trạng thái đăng nhập
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.clear(); // Xóa localStorage
    setIsLoggedIn(false); // Đặt trạng thái chưa đăng nhập
    setEmail(''); // Xóa email
    // Chuyển hướng về trang login
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  // Toggle Dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#user-menu-button')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Deep Tranfer
          </span>
        </Link>

        {/* User Section */}
        <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                id="user-menu-button"
                onClick={toggleDropdown}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src="/user.jpg"
                  alt="user photo"
                />
              </button>
              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="items-center justify-around hidden w-full md:flex md:w-auto md:order-1">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <Link href="/" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link href="/user/cart" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">
              Cart
            </Link>
          </li>
          <li>
            <Link href="/user/product" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">
              Product
            </Link>
          </li>
          <li>
            <Link href="/user/new" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">
              New
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
