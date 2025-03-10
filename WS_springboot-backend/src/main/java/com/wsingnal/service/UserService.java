package com.wsingnal.service;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wsingnal.dto.UserDto;
import com.wsingnal.model.User;
import com.wsingnal.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	final private PasswordEncoder passwordEncoder;

	public UserService() {
		this.passwordEncoder = new BCryptPasswordEncoder();
	}

	
	public String checkPhoneNumber(String phone) {
        // 전화번호 중복 체크
        if (userRepository.findByPhone(phone).isPresent()) {
            return "이미 가입된 전화번호입니다."; // 전화번호 중복
        }
        return "사용 가능한 번호입니다."; // 중복되지 않으면 사용 가능한 번호
    }
	
	public String registerUser(UserDto userDto) {
	    // 이메일 중복 체크
	    if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
	       
	    	return "이미 사용 중인 이메일입니다."; // 이메일 중복
	    }


	    // 비밀번호 암호화
	    String encodedPassword = passwordEncoder.encode(userDto.getPassword());

	    // 사용자 객체 생성 및 저장
	    User user = new User();
	    user.setId(UUID.randomUUID().toString());
	    user.setEmail(userDto.getEmail());
	    user.setPassword(encodedPassword);
	    user.setNickname(userDto.getNickname());
	    user.setBirthdate(userDto.getBirthdate());
	    user.setGender(userDto.getGender());
	    user.setPhone(userDto.getPhone());
	    user.setCreatedAt(new Date());
	    user.setUpdatedAt(new Date());

	    userRepository.save(user);
	    return "회원가입 성공!"; // 성공 메시지
	}
}