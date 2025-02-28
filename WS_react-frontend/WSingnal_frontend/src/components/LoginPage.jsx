import React, { useState } from 'react';
import '../assets/css/LoginPage.css';
import SignUp from './SignUp';  // Signup 임포트

// LoginPage.jsx
const LoginPage = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
  
    const handleLogin = (e) => {
      e.preventDefault();
      console.log('로그인 시도:', email, password);
    };
  
    const toggleModal = () => {
      setIsLoginMode(!isLoginMode);
    };
  
    return (
      <div className="login-page">
        <h2 className="form-header">{isLoginMode ? '로그인' : '회원가입'}</h2>
  
        {/* 로그인 폼 */}
        {isLoginMode ? (
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
        ) : (
        // 회원가입 폼
        <div className="signup-modal">
          <SignUp closeModal={toggleModal} />
        </div>
        )}
  
        {/* 추가 버튼 영역 */}
        <div className="login-options">
          <button onClick={toggleModal} className="register-btn">
            {isLoginMode ? '회원가입' : '이미 계정이 있나요? 로그인'}
          </button>
          {isLoginMode && (
            <>
              <button className="forgot-btn">아이디 / 비밀번호 찾기</button>
              <button className="kakao-login-btn">카카오로 시작하기</button>
            </>
          )}
        </div>
      </div>
    );
  };
  

export default LoginPage;
