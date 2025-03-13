package com.wsingnal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wsingnal.model.User;
import com.wsingnal.repository.UserRepository;

@Service
public class PasswordChangeService {

	@Autowired
	UserRepository userRepository;
	
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();  // BCrypt 사용

    public boolean verifyCurrentPassword(String email, String password) {
        // 사용자의 이메일을 통해 User 객체를 가져옵니다.
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            // 저장된 암호화된 비밀번호와 사용자가 입력한 비밀번호를 비교
            return passwordEncoder.matches(password, user.get().getPassword());
        }
        
        return false; // 사용자가 없으면 비밀번호 검증 실패
    }
}
	
	

