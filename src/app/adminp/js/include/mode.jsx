import { useState, useEffect } from 'react';
import { IoMenu, IoSunny, IoMoon  } from "react-icons/io5";
const Click = () => {
  // const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);

  // chua sua(sai)
  // const toggleMenu = () => {
  //   setMenuOpen(true);
  // };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode-variables');
    } else {
      document.body.classList.remove('dark-mode-variables');
    }
  }, [isDarkMode]);

  return (
    <div>
      <button id="menu-btn" >
        <span><IoMenu/></span>
      </button>
      <div className="dark-mode" onClick={toggleDarkMode}>
          <span className={!isDarkMode ? "active" : ""}><IoSunny/></span>
          <span className={isDarkMode ? "active" : ""}><IoMoon  /></span>
      </div>
    </div>
  );
};

export default Click;
