import React, { useState, useEffect } from 'react';
import '../assets/css/ProfilePage.css';

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);

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

  // 사용자 정보가 없을 경우 로딩 상태 표시
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>회원 정보</h2>
      <div className="profile-info">
        <p><strong>이름:</strong> {userInfo.nickname}</p>
        <p><strong>이메일:</strong> {userInfo.email}</p>
        <p><strong>성별:</strong> {userInfo.gender}</p>
        <p><strong>전화번호:</strong> {userInfo.phone}</p>
        <p><strong>가입일:</strong> {new Date(userInfo.createdAt).toISOString().split('T')[0]}</p>
      </div>

      <button onClick={() => alert('수정 기능 구현 예정')}>회원 정보 수정</button>
    </div>
  );
}

export default ProfilePage;