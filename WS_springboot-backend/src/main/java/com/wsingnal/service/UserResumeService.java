package com.wsingnal.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wsingnal.dto.UserResumeDto;
import com.wsingnal.entity.User;
import com.wsingnal.entity.UserResume;
import com.wsingnal.repository.UserRepository;
import com.wsingnal.repository.UserResumeRepository;

@Service
public class UserResumeService {

    @Autowired
    private UserResumeRepository userResumeRepository;

    @Autowired
    private UserRepository userRepository;

    
    
    public String saveResume(UserResumeDto userResumeDto, String loginUser) {
        // loginUser가 null인지 확인
        if (loginUser == null) {
            throw new RuntimeException("Login user is null");
        }

        Optional<User> email = userRepository.findByEmail(loginUser);
        
        if (!email.isPresent()) {
            throw new RuntimeException("User not found for email: " + loginUser);
        }
        
        User user = email.get();  // 여기서 get() 호출

        try {
            UserResume userResume = new UserResume();
            
            // UserResume 객체에 값 설정
            userResume.setUser(user);
            userResume.setMbti(userResumeDto.getMbti());
            userResume.setHeight(userResumeDto.getHeight());
            userResume.setRegion(userResumeDto.getRegion());
            userResume.setBirthdate(userResumeDto.getBirthdate());
            userResume.setIntroduction(userResumeDto.getIntroduction());
            userResume.setPhoto1(userResumeDto.getPhoto1());
            userResume.setPhoto2(userResumeDto.getPhoto2());
            userResume.setCreated_at(new Date());
            

            // 저장
            userResumeRepository.save(userResume);

            return "success"; // 성공 메시지
        } catch (Exception e) {
            throw new RuntimeException("Resume save failed: " + e.getMessage()); // 오류 발생 시 예외 처리
        }
    }
}