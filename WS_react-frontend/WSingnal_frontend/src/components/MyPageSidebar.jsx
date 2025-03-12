import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/MyPageSidebar.css';

const MyPageSidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar(); // 페이지 이동 후 사이드바 닫기
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={closeSidebar}>X</button>
      <ul>
        <li><button onClick={() => handleNavigation('/profile')}>회원정보</button></li>
        <li><button onClick={() => handleNavigation('/resume')}>자기소개서</button></li>
        <li><button onClick={() => handleNavigation('/payment')}>결제내역</button></li>
      </ul>
    </div>
  );
};

export default MyPageSidebar;
