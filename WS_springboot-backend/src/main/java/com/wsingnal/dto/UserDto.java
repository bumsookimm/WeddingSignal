package com.wsingnal.dto;

import java.sql.Date;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {

	 @Email(message = "유효한 이메일을 입력하세요")
	    private String email;

	    @NotEmpty(message = "비밀번호를 입력하세요")
	    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
	    private String password;

	    @NotEmpty(message = "비밀번호 확인을 입력하세요")
	    private String confirmPassword;

	    @NotEmpty(message = "닉네임을 입력하세요")
	    private String nickname;

	    @NotNull(message = "생년월일을 입력하세요")
	    private Date birthdate;

	    @NotNull(message = "성별을 선택하세요")
	    private String gender;

	    @NotEmpty(message = "휴대폰 번호를 입력하세요")
	    private String phone;

	    @NotNull(message = "약관에 동의해야 합니다")
	    private Boolean agree;
	
}
