'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa';
import './page.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState(''); // Lưu email người dùng
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  // Kiểm tra trạng thái đăng nhập
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset lỗi trước khi gửi request
  
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      document.cookie = `token=${data.token}; path=/`;  // Lưu token vào cookie
  
      localStorage.setItem('email', email); // Lưu email người dùng
      
      // Giải mã token để lấy user_id và kiểm tra role
      const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
      console.log("Decoded Token:", decodedToken);  // In ra thông tin của token

      // Lưu user_id vào localStorage
      localStorage.setItem('user_id', decodedToken.id);  // Lưu user_id vào localStorage
      localStorage.setItem('role', decodedToken.role);
  
      // In ra giá trị role từ token
      console.log("Role in token:", decodedToken.role);  
  
      if (decodedToken.role === 1) {
        router.push('/adminp');  // Nếu là admin, chuyển hướng đến trang admin
      } else {
        setIsLoggedIn(true);
        setUserEmail(email);
        router.push('/');  // Nếu không phải admin, chuyển hướng về trang chính
      }
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData?.message || 'Login failed. Please check your credentials.');
    }
  };
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
  
    let data;
    try {
      data = await response.json();
    } catch (error) {
      setErrorMessage('Unexpected server response. Please try again.');
      return;
    }
  
    if (response.ok) {
      document.cookie = `token=${data.token}; path=/`;
      localStorage.setItem('email', email);
      router.push('/');
    } else {
      setErrorMessage(data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };


  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
      <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebook /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedin /></a>
          </div>
          <span>or use your email for registration</span>
          {errorMessage && <div className="error-message text-red-600 mb-4">{errorMessage}</div>}
          <input 
            type="text" 
            placeholder="Name" 
            name="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#">
                <FaFacebook className="icon" />
              </a>
              <a href="#">
                <FaGithub className="icon" />
              </a>
              <a href="#">
                <FaGoogle className="icon" />
              </a>
              <a href="#">
                <FaLinkedin className="icon" />
              </a>
            </div>
            <span>or use your email and password</span>
            {errorMessage && (
              <div className="error-message text-red-600 mb-4">{errorMessage}</div>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#">Forgot Password?</a>
            <button type="submit">Login</button>
          </form>
        </div>

       

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button  onClick={handleToggle}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button  onClick={handleToggle}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
