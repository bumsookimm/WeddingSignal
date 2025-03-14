import React, { useState } from 'react';
import axios from 'axios'; // axios 추가
import '../assets/css/ResumePage.css';

const ResumePage = () => {
  const [formData, setFormData] = useState({
    photo1: '',
    photo2: '',
    mbti: '',
    height: '',
    birthdate: '',
    introduction: '',
    region: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, photoNumber) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [photoNumber]: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    const resumeData = {
      photo1: formData.photo1, // base64 또는 이미지 URL
      photo2: formData.photo2, // base64 또는 이미지 URL
      mbti: formData.mbti,
      height: formData.height,
      birthdate: formData.birthdate,
      introduction: formData.introduction,
      region: formData.region,
    };
  
    try {
        const response = await axios.post('http://localhost:8070/api/resume/save', resumeData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
    
        if (response.data.success) {
          alert('자기소개서가 저장되었습니다!');
        }
      } catch (error) {
        console.error('Error saving resume:', error);
        alert('자기소개서를 저장하는 데 실패했습니다.');
      }
    };

  return (
    <div className="resume-page">
      <h2>자기소개서</h2>
      <form className="resume-form">
        <div className="form-group photos">
          <div className="photo-box">
            <input
              type="file"
              accept="image/*"
              id="photo1"
              onChange={(e) => handleFileChange(e, 'photo1')}
              className="file-input"
            />
            {formData.photo1 ? (
              <img src={formData.photo1} alt="Photo 1" className="photo-preview" />
            ) : (
              <span>+ 사진 추가</span>
            )}
          </div>

          <div className="photo-box">
            <input
              type="file"
              accept="image/*"
              id="photo2"
              onChange={(e) => handleFileChange(e, 'photo2')}
              className="file-input"
            />
            {formData.photo2 ? (
              <img src={formData.photo2} alt="Photo 2" className="photo-preview" />
            ) : (
              <span>+ 사진 추가</span>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label>지역</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="거주 지역을 입력하세요"
          />
        </div>
        
        <div className="form-group">
          <label>MBTI</label>
          <input
            type="text"
            name="mbti"
            value={formData.mbti}
            onChange={handleChange}
            placeholder="MBTI를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>키</label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="키를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>생년월일</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>자기소개</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            placeholder="자기소개를 입력하세요"
          />
        </div>

        <button type="button" className="save-btn" onClick={handleSave}>
          저장
        </button>
      </form>
    </div>
  );
};

export default ResumePage;
