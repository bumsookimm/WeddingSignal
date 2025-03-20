import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/ResumePage.css';

const ResumePage = () => {
  const [formData, setFormData] = useState({
    photo1: null,  // 파일 객체로 변경
    photo2: null,  // 파일 객체로 변경
    mbti: "",
    height: "",
    birthdate: "",
    introduction: "",
    region: "",
  });

  const [errors, setErrors] = useState({
    photo1: false,
    photo2: false,
    mbti: false,
    height: false,
    birthdate: false,
    introduction: false,
    region: false,
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

    // 유효성 검사
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value, // 값이 없으면 오류 표시
    }));
  };

  const handleFileChange = (e, photoKey) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [photoKey]: file,  // 실제 파일 객체로 저장
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [photoKey]: false,
      }));
    }
  };

  const handleSave = async () => {
    const newErrors = {
      photo1: !formData.photo1,
      photo2: !formData.photo2,
      mbti: !formData.mbti,
      height: !formData.height,
      birthdate: !formData.birthdate,
      introduction: !formData.introduction,
      region: !formData.region,
    };
  
    setErrors(newErrors);
  
    // 하나라도 비어 있으면 저장하지 않음
    if (Object.values(newErrors).includes(true)) {
      return;
    }
  
    // FormData로 변환하여 서버로 전송
    const data = new FormData();
    data.append('mbti', formData.mbti);
    data.append('height', formData.height);
    data.append('birthdate', formData.birthdate);
    data.append('introduction', formData.introduction);
    data.append('region', formData.region);
    
    // 파일도 FormData에 첨부
    if (formData.photo1) data.append('photo1', formData.photo1);
    if (formData.photo2) data.append('photo2', formData.photo2);
  
    console.log("data: ", data);
    try {
      const response = await axios.post("http://localhost:8070/api/resume/save", data, {
        headers: { "Content-Type": "multipart/form-data" },
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

  const handleDelete = async () => {
    if (!formData.resume_id) {
      alert("잘못된 요청입니다. 자기소개서를 찾을 수 없습니다.");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:8070/api/resume/delete/${formData.resume_id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  
      if (response.data.success) {
        setFormData({
          photo1: null,
          photo2: null,
          mbti: "",
          height: "",
          birthdate: "",
          introduction: "",
          region: "",
        });
        alert("자기소개서가 삭제됐습니다!");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("자기소개서를 삭제하는 데 실패했습니다.");
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
                {formData[photoKey] && typeof formData[photoKey] === 'string' && formData[photoKey].startsWith("http") ? (
                  <img
                    src={formData[photoKey]}  // 서버에서 반환된 URL 사용
                    alt={photoKey}
                    className="photo-preview"
                  />
                ) : formData[photoKey] && formData[photoKey] instanceof File ? (
                  <img
                    src={URL.createObjectURL(formData[photoKey])}  // 로컬 파일 미리보기
                    alt={photoKey}
                    className="photo-preview"
                  />
                ) : (
                  <span>+ 사진 추가</span>
                )}
               
                {errors[photoKey] && !formData[photoKey] && <span className="error-message">사진을 추가하세요.</span>}
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
              value={formData[name] || ""}  // 빈 문자열로 처리하여 undefined 방지
              onChange={handleChange}
              placeholder={placeholder || ""}
            />
            {errors[name] && <span className="error-message">{label}을 입력하세요.</span>}
          </div>
        ))}

        <div className="form-group">
          <label>자기소개</label>
          <textarea
            name="introduction"
            value={formData.introduction || ""}  // 빈 문자열로 처리하여 undefined 방지
            onChange={handleChange}
            placeholder="자기소개를 입력하세요"
          />
          {errors.introduction && <span className="error-message">자기소개를 입력하세요.</span>}
        </div>

        <div className="button-group">
          <button type="button" className="save-btn" onClick={handleSave}>
            저장
          </button>
          <button type="button" className="delete-btn" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumePage;
