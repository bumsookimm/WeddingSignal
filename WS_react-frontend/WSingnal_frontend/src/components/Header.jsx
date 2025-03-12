import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';
import LoginPage from './LoginPage';
import SignUp from './SignUp';
import AgreeModal from './AgreeModal';
import MyPageSidebar from './MyPageSidebar';  

function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAgreeModalOpen, setIsAgreeModalOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:8070/api/checkLoginStatus', {
        method: 'GET',
        credentials: 'include'
      });
      const result = await response.text();
      setIsLoggedIn(result === 'LOGGED_IN');
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const handleAgreeModal = () => {
    setIsAgreeModalOpen(!isAgreeModalOpen);
  };

  const handleMyPageToggle = () => {
    setIsMyPageOpen(!isMyPageOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8070/api/logout', {
        method: 'GET',
        credentials: 'include',  // 쿠키와 세션을 서버와 공유
      });
      setIsLoggedIn(false);  // 로그아웃 후 상태 업데이트
      window.location.reload();  // 새로고침하여 상태 반영
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <img src="/images/ws_logo.png" alt="Logo" />
          </Link>
        </div>

        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/review">Review</Link></li>
            <li><Link to="/posts">Post</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/Contact">Contact Us</Link></li>
            {isLoggedIn ? (
              <>
                <li><button onClick={handleMyPageToggle}>My Page</button></li>
                <li><button onClick={handleLogout}>Log Out</button></li>
              </>
            ) : (
              <>
                <li><button onClick={handleLoginModal}>Log In</button></li>
                <li><button onClick={() => setIsAgreeModalOpen(true)}>SignUp</button></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {isLoginModalOpen && (
        <div className="login-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleLoginModal}>X</button>
            <LoginPage closeModal={handleLoginModal} />
          </div>
        </div>
      )}

      {isAgreeModalOpen && <AgreeModal closeModal={handleAgreeModal} openSignUp={handleSignUpModal} />}
      {isSignUpModalOpen && (
        <div className="login-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsSignUpModalOpen(false)}>X</button>
            <SignUp closeModal={() => setIsSignUpModalOpen(false)} />
          </div>
        </div>
      )}

      {/* 마이페이지 사이드바 */}
      <MyPageSidebar isOpen={isMyPageOpen} closeSidebar={handleMyPageToggle} />
    </header>
  );
}

export default Header;
