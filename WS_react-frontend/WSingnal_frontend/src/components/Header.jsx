import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';
import LoginPage from './LoginPage';
import SignUp from './SignUp';  // SignUp 컴포넌트 임포트
import AgreeModal from './AgreeModal';  // AgreeModal 임포트

function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);  // 회원가입 모달 상태
  const [isAgreeModalOpen, setIsAgreeModalOpen] = useState(false); // 약관 동의 모달 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:8070/api/checkLoginStatus', {
        method: 'GET',
        credentials: 'include' // 세션 쿠키 포함
      });
      const result = await response.text();
      setIsLoggedIn(result === 'LOGGED_IN'); // 로그인 상태에 따라 설정
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트 마운트 시 로그인 상태 체크
  }, []);


  const handleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleSignUpModal = () => {
    setIsSignUpModalOpen(true);  // 약관 동의가 완료되면 회원가입 모달 열기
  };

  const handleAgreeModal = () => {
    setIsAgreeModalOpen(!isAgreeModalOpen);  // 약관 동의 모달 토글
  };

  const handleMyPageRedirect = () => {
    window.location.href = '/myPage'; // My Page로 리다이렉트
  };
  
  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      await fetch('/api/logout');
      setIsLoggedIn(false); // 로그아웃 후 로그인 상태 변경
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
            {/* 로그인/로그아웃 버튼 */}
            {isLoggedIn ? (
              <>
                <li><button onClick={handleMyPageRedirect}>My Page</button></li>  {/* My Page 버튼 */}
                <li><button onClick={handleLogout}>Log Out</button></li> {/* 로그아웃 버튼 */}
              </>
            ) : (
              <>
                <li><button onClick={handleLoginModal}>Log In</button></li>
                <li><button onClick={() => setIsAgreeModalOpen(true)}>SignUp</button></li>  {/* 약관 동의 모달 열기 */}
              </>
            )}
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

      {/* 약관 동의 모달 */}
      {isAgreeModalOpen && (
        <AgreeModal closeModal={handleAgreeModal} openSignUp={handleSignUpModal} />
      )}

      {/* 회원가입 모달 */}
      {isSignUpModalOpen && (
        <div className="login-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsSignUpModalOpen(false)}>X</button>
            <SignUp closeModal={() => setIsSignUpModalOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
