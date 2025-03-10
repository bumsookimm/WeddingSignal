import React, { useState } from "react";
import '../assets/css/AgreeModal.css'; // CSS 스타일

const AgreeModal = ({ closeModal, openSignUp }) => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isOver19Checked, setIsOver19Checked] = useState(false);

  const handleTermsChange = (e) => setIsTermsChecked(e.target.checked);
  const handlePrivacyChange = (e) => setIsPrivacyChecked(e.target.checked);
  const handleOver19Change = (e) => setIsOver19Checked(e.target.checked);

  const handleSubmit = () => {
    if (isTermsChecked && isPrivacyChecked && isOver19Checked) {
      alert("동의가 완료되었습니다.");
      openSignUp(); // 동의 후 회원가입 모달 열기
      closeModal(); // 약관 동의 모달 닫기
    } else {
      alert("모든 약관에 동의해야 합니다.");
    }
  };

  return (
    <div className="agree-modal">
      <div className="modal-content">
        <h3>약관 동의</h3>
        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={isTermsChecked}
              onChange={handleTermsChange}
            />
            <span>이용약관 동의</span>
          </label>
          <div className="checkbox-box">
            <p>이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력이 발생합니다.
                 관계법령에 위배되지 않는 범위 내에서 개정 될 수 있으며, 이는 서비스 공지사항, 
                 홈페이지 게시, 개별 안내 등 기타 수단 중 한가지 방법으로 게시하여 효력을 
                 인정 받습니다. 이용자의 이 약관에 대한 동의는 '웨딩시그널' 웹사이트나 모바일 
                 웹사이트 또는 모바일 어플리케이션 등을 방문하여 약관의 변경 사항을 확인하는 것에 
                 대한 동의를 포함합니다. 이용자는 개정된 약관에 동의하지 않을 경우 
                 '웨딩시그널'에게 계약해지 및 이용 중지를 요청할 수 있으며, 
                 계속 서비스를 이용할 경우 변경된 약관에 동의하는 것으로 간주됩니다.
            </p>
          </div>

          <label>
            <input
              type="checkbox"
              checked={isPrivacyChecked}
              onChange={handlePrivacyChange}
            />
            <span>개인정보 수집 및 이용 동의 </span>
          </label>
          <div className="checkbox-box">
            <p>이용자는 개정된 약관에 동의하지 않을 경우 
                 '웨딩시그널'에게 계약해지 및 이용 중지를 요청할 수 있으며, 
                 계속 서비스를 이용할 경우 변경된 약관에 동의하는 것으로 간주됩니다.</p>
          </div>

          <label>
            <input
              type="checkbox"
              checked={isOver19Checked}
              onChange={handleOver19Change}
            />
            <span>만 19세 이상입니다. </span>
          </label>
        </div>

        <div className="modal-buttons">
          <button className="cancel-button" onClick={closeModal}>취소</button>
          <button className="agree-button" onClick={handleSubmit} disabled={!(isTermsChecked && isPrivacyChecked && isOver19Checked)}>
            동의하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreeModal;
