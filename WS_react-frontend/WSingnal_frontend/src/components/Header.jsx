import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';
import LoginPage from './LoginPage';
import SignUp from './SignUp';  // SignUp 컴포넌트 임포트

function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);  // 회원가입 모달 상태

  const handleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleSignUpModal = () => {
    setIsSignUpModalOpen(!isSignUpModalOpen);  // 회원가입 모달 토글
  };

  return (
    <header className="header">
      <div className="nav-container">
        {/* 로고 영역 */}
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
            <li><button onClick={handleLoginModal}>Log In</button></li>
            <li><button onClick={handleSignUpModal}>SignUp</button></li> 
          </ul>
        </nav>
      </div>

      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <div className="login-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleLoginModal}>X</button>
            <LoginPage closeModal={handleLoginModal} />
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {isSignUpModalOpen && (
        <div className="login-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleSignUpModal}>X</button>
            <SignUp closeModal={handleSignUpModal} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;