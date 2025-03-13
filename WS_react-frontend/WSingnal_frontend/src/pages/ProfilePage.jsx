import React, { useState, useEffect } from 'react';
import '../assets/css/ProfilePage.css';

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: 현재 비밀번호, 2: 새로운 비밀번호
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const resetPasswordFields = () => {
    setStep(1);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };
  // 사용자 정보를 API로부터 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:8070/api/userInfo', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  // 비밀번호 변경 요청 처리
  const handlePasswordChange = async () => {
    if (step === 1) {
      const response = await fetch('http://localhost:8070/api/verifyCurrentPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword })
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        return;
      }
    
      const data = await response.json();
    
      if (data.success) {
        setErrorMessage(''); // 오류 메시지 초기화
        setStep(2); // 새로운 비밀번호 입력 단계로 이동
      } else {
        setErrorMessage('현재 비밀번호가 잘못되었습니다.');
      }
    
      
    } else if (step === 2) {
      // 2단계: 새 비밀번호 확인
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
        return;
      }
  
      const response = await fetch('http://localhost:8070/api/changePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || '비밀번호 변경에 실패했습니다.');
        return;
      }
  
      const data = await response.json();
  
      if (data.success) {
        setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
        setIsModalOpen(false); // 모달 닫기
      } else {
        setErrorMessage('비밀번호 변경에 실패했습니다.');
      }
    }
  };

  // 사용자 정보가 없을 경우 로딩 상태 표시
  if (!userInfo) {
    return <div>로그인이 필요합니다</div>;
  }

  return (
    <div className="profile-page">
      <h2>회원 정보</h2>
      <div className="profile-info">
        <p><strong>이름:</strong> {userInfo.nickname}</p>
        <p><strong>이메일:</strong> {userInfo.email}</p>
        <p><strong>성별:</strong> {userInfo.gender}</p>
        <p><strong>전화번호:</strong> {userInfo.phone}</p>
        <p><strong>생년월일:</strong> {new Date(userInfo.birthdate).toISOString().split('T')[0]}</p>
        <p><strong>가입일:</strong> {new Date(userInfo.createdAt).toISOString().split('T')[0]}</p>
      </div>

      <button className="profile-btn" onClick={() => setIsModalOpen(true)}>비밀번호 변경</button>

      {/* 비밀번호 변경 모달 */}

      {isModalOpen && (
      <div className={`modal ${isModalOpen ? 'open' : ''}`}>
      <div className="modal-content">

      
      {/* 닫기 버튼 */}
      <button className="close-btn" onClick={() => { 
        resetPasswordFields();
        setIsModalOpen(false);
      }}>×</button>
      
      <h3>비밀번호 변경</h3>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {step === 1 ? (
        <>
          <div>
            <label>현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <button className="current-password-btn" onClick={handlePasswordChange}>현재 비밀번호 확인</button>
        </>
      ) : (
        <>
          <div>
            <label>새로운 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label>새로운 비밀번호 확인</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <button className="new-password-btn" onClick={handlePasswordChange}>비밀번호 변경</button>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
}

export default ProfilePage;
