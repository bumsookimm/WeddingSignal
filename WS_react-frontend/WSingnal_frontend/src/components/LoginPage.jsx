import React, { useState } from 'react';
import '../assets/css/LoginPage.css';
import SignUp from './SignUp';  // SignUp 임포트
import AgreeModal from './AgreeModal';  // AgreeModal 임포트

// LoginPage.jsx
const LoginPage = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgreeModalOpen, setIsAgreeModalOpen] = useState(false); // 동의 모달 상태
  const [isSignUpMode, setIsSignUpMode] = useState(false); // 회원가입 모달 상태
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8070/api/checkLogin', {  // Spring 서버 URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // JSON 형식으로 변환
        credentials: 'include',
      });
  
      const result = await response.text(); // 서버 응답 받기
  
      if (result === 'SUCCESS') {
        alert('로그인 성공!');
        // 로그인 후 처리 (예: 메인 페이지로 이동)
        window.location.href = '/';
      } else {
        alert('로그인 실패! 이메일 또는 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
    }
  };

  const toggleModal = () => {
    setIsSignUpMode(!isSignUpMode); // 회원가입 모드 토글
  };

  const openAgreeModal = () => {
    setIsAgreeModalOpen(true);
  };

  const closeAgreeModal = () => {
    setIsAgreeModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsAgreeModalOpen(false);  // 동의 모달 닫기
    setIsSignUpMode(true); // 회원가입 모달 열기
  };

  return (
    <div className="login-page">
      {/* 로그인 폼 */}
      {!isSignUpMode ? (
        <>
          <h2 className="form-header"> 로그인 </h2>
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label className={email ? 'active' : ''}>아이디</label>
            </div>

            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
              />
              <label className={password ? 'active' : ''}>비밀번호</label>
            </div>

            <button type="submit" className="submit-btn">로그인</button>
          </form>

          {/* 로그인 모드일 때만 보이는 3개의 버튼 */}
          <div className="login-options">
            <button onClick={openAgreeModal} className="register-btn">
              회원가입
            </button>
            <button className="forgot-btn">
              아이디 / 비밀번호 찾기
            </button>
            <button className="kakao-login-btn">
              카카오로 시작하기
            </button>
          </div>
        </>
      ) : (
        // 회원가입 폼 (isSignUpMode일 때만)
        <div className="signup-modal">
          <SignUp closeModal={toggleModal} />
        </div>
      )}

      {/* 동의 모달 */}
      {isAgreeModalOpen && (
        <AgreeModal closeModal={closeAgreeModal} openSignUp={openSignUpModal} />
      )}
    </div>
  );
};

export default LoginPage;
