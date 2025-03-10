package com.wsingnal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wsingnal.model.User;
import com.wsingnal.repository.UserRepository;

@Service
public class LoginService {

	@Autowired
	private UserRepository userRepository;	

    @Autowired
    private PasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 PasswordEncoder

    public String checkLogin(String email, String password) {
        // 이메일로 사용자 정보 조회
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // 입력된 비밀번호와 저장된 비밀번호를 비교 (BCryptPasswordEncoder 사용)
            if (passwordEncoder.matches(password, user.getPassword())) {
                return "SUCCESS";
            }
        }
        return "FAIL"; // 인증 실패
    }
}