import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/ResumePage.css';

const ResumePage = () => {
  const [formData, setFormData] = useState({
    photo1: "",
    photo2: "",
    mbti: "",
    height: "",
    birthdate: "",
    introduction: "",
    region: "",
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get("http://localhost:8070/api/resume", {
          withCredentials: true,
        });
        
        if (response.status === 200) {
          setFormData(response.data);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, photoKey) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [photoKey]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:8070/api/resume/save", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        alert("자기소개서가 저장되었습니다!");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("자기소개서를 저장하는 데 실패했습니다.");
    }
  };

  return (
    <div className="resume-page">
      <h2>자기소개서</h2>
      <form className="resume-form">
        <div className="form-group photos">
          {["photo1", "photo2"].map((photoKey) => (
            <div className="photo-box" key={photoKey}>
              <input
                type="file"
                accept="image/*"
                id={photoKey}
                onChange={(e) => handleFileChange(e, photoKey)}
                className="file-input"
              />
              {formData[photoKey] ? (
                <img src={formData[photoKey]} alt={photoKey} className="photo-preview" />
              ) : (
                <span>+ 사진 추가</span>
              )}
            </div>
          ))}
        </div>

        {[
          { label: "지역", name: "region", type: "text", placeholder: "거주 지역을 입력하세요" },
          { label: "MBTI", name: "mbti", type: "text", placeholder: "MBTI를 입력하세요" },
          { label: "키", name: "height", type: "text", placeholder: "키를 입력하세요" },
          { label: "생년월일", name: "birthdate", type: "date" },
        ].map(({ label, name, type, placeholder }) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder || ""}
            />
          </div>
        ))}

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
