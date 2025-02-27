import React, { useState } from 'react';
import '../assets/css/LoginPage.css';

const LoginPage = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('로그인 시도:', email, password);
        closeModal();
    };

    return (
        <div className="login-page">
            <h2>로그인</h2>
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

            {/* 추가 버튼 영역 */}
            <div className="login-options">
                <button className="register-btn">회원가입</button>
                <button className="forgot-btn">아이디 / 비밀번호 찾기</button>
                <button className="kakao-login-btn">카카오로 시작하기</button>
            </div>
        </div>
    );
};

export default LoginPage;
