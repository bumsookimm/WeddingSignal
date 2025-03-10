import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import '../assets/css/SignUp.css';


// 유효성 검사 스키마
const schema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(/[a-z]/, "소문자를 포함해야 합니다")
    .regex(/[0-9]/, "숫자를 포함해야 합니다")
    .regex(/[@$!%*?&]/, "특수문자를 포함해야 합니다"),
  
  confirmPassword: z.string(),
  nickname: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  birthdate: z.string(),
  gender: z.enum(["male", "female"], { required_error: "성별을 선택하세요" }),
  phone: z.string().min(10, "휴대폰 번호를 입력하세요"),
  agree: z.literal(true, { errorMap: () => ({ message: "약관에 동의해야 합니다" }) })
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

const SignUp = ({ closeModal }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [userInputCode, setUserInputCode] = useState(""); 
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isVerificationButtonDisabled, setIsVerificationButtonDisabled] = useState(false);


  const sendVerificationCode = async () => {
    const phone = document.getElementById("phone").value;
    try {
      const response = await axios.post(
        "http://localhost:8070/api/checkPhoneNumber",
        { phone },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (response.data === "이미 가입된 전화번호입니다.") {
        alert("이미 가입된 전화번호입니다.");
        return;
      }
      await axios.post("http://localhost:8070/api/sendVerificationCode", { phone });
      alert("인증 코드가 전송되었습니다.");
      setIsCodeSent(true);
      setIsVerificationButtonDisabled(true);
    } catch (error) {
      alert("인증 코드 전송에 실패했습니다.");
    }
  };

  const verifyCode = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8070/api/verifyCode",
        { phone: document.getElementById("phone").value, code: userInputCode },
        { headers: { "Content-Type": "application/json" } }
      );
      if (data === "인증 성공") {
        alert("휴대폰 인증 성공!");
        setIsPhoneVerified(true);
      } else {
        alert("인증 코드가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("인증 코드 확인에 실패했습니다.");
    }
  };

  const onSubmit = async (data) => {
    if (!isPhoneVerified) {
      alert("휴대폰 인증을 해주세요.");
      return;
    }
    try {
      await axios.post("http://localhost:8070/api/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      alert("회원가입 성공!");
      closeModal();
    } catch (error) {
      setError("email", { message: "이미 사용 중인 이메일입니다" });
    }
  };

  return (
    <div className="signup-modal">
      <h2 className="signup-title">회원가입</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form p-6 border rounded-lg">
        <input type="email" {...register("email")} placeholder="이메일" />
        {errors.email && <p>{errors.email.message}</p>}

        <input type="password" {...register("password")} placeholder="비밀번호" />
        {errors.password && <p>{errors.password.message}</p>}

        <input type="password" {...register("confirmPassword")} placeholder="비밀번호 확인" />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        <input type="text" {...register("nickname")} placeholder="이름" />
        {errors.nickname && <p>{errors.nickname.message}</p>}

        <label>생년월일</label>
        <input type="date" {...register("birthdate")} />
        <label>성별</label>
        <select {...register("gender")}>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>

        <input id="phone" type="text" {...register("phone")} placeholder="휴대폰 번호" />
        {errors.phone && <p>{errors.phone.message}</p>}

        <button type="button" onClick={sendVerificationCode} disabled={isVerificationButtonDisabled}>
          휴대폰 인증
        </button>

        {isCodeSent && (
          <>
            <input
              type="text"
              placeholder="인증 코드를 입력하세요"
              onChange={(e) => setUserInputCode(e.target.value)}
            />
            <button type="button" onClick={verifyCode}>인증 코드 확인</button>
          </>
        )}

        <label>
          <input type="checkbox" {...register("agree", { value: true })} defaultChecked /> 
          <span> 개인정보 처리방침 동의</span>
        </label>
        {errors.agree && <p>{errors.agree.message}</p>}

        <button
          type="submit"
          className={`signup-submit-button ${isPhoneVerified ? 'active' : ''}`}
          disabled={!isPhoneVerified}
        >
          회원가입
        </button>
      </form>

   
    </div>
  );
};

export default SignUp;
