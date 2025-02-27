import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';  // Header 컴포넌트 임포트
import MainPage from './components/MainPage';   // MainPage 컴포넌트 임포트
import LoginPage from './components/LoginPage'; // LoginPage 컴포넌트 임포트


function App() {
  return (
    <Router>
      <Header />  {/* 상단 바를 모든 페이지에 표시 */}
      <Routes>
        <Route path="/" element={<MainPage />} />  {/* 메인 페이지 */}
        <Route path="/login" element={<LoginPage />} />  {/* 로그인 페이지 */}

      </Routes>
    </Router>
  );
}

export default App;