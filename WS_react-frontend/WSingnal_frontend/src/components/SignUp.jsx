import React from "react";
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
    .regex(/[A-Z]/, "대문자를 포함해야 합니다")
    .regex(/[a-z]/, "소문자를 포함해야 합니다")
    .regex(/[0-9]/, "숫자를 포함해야 합니다")
    .regex(/[@$!%*?&]/, "특수문자를 포함해야 합니다"),
  confirmPassword: z.string(),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다"),
  birthdate: z.string(),
  gender: z.enum(["male", "female"], { required_error: "성별을 선택하세요" }),
  phone: z.string().min(10, "휴대폰 번호를 입력하세요"),
  agree: z.literal(true, { errorMap: () => ({ message: "약관에 동의해야 합니다" }) })
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8080/api/signup", data);
      alert("회원가입 성공!");
    } catch (error) {
      setError("email", { message: "이미 사용 중인 이메일입니다" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="signup-form p-6 border rounded-lg">
    

      <input
        type="email"
        {...register("email")}
        placeholder="이메일"
      />
      {errors.email && <p>{errors.email.message}</p>}

   
      <input
        type="password"
        {...register("password")}
        placeholder="비밀번호"
      />
      {errors.password && <p>{errors.password.message}</p>}

     
      <input
        type="password"
        {...register("confirmPassword")}
        placeholder="비밀번호 확인"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

    
      <input
        type="text"
        {...register("nickname")}
        placeholder="이름"
      />
      {errors.nickname && <p>{errors.nickname.message}</p>}

      <label>생년월일</label>
      <input type="date" {...register("birthdate")} />

      <label>성별</label>
      <select {...register("gender")}>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>

      
      <input
        type="text"
        {...register("phone")}
        placeholder="휴대폰 번호"
      />
      {errors.phone && <p>{errors.phone.message}</p>}

      <label>
        <input type="checkbox" {...register("agree")} /> 개인정보 처리방침 동의
      </label>
      {errors.agree && <p>{errors.agree.message}</p>}

      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignupForm;
