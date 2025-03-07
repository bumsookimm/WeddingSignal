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
  
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', email, password);
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
