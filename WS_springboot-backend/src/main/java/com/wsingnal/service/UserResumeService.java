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
            // 기존 자기소개서가 있는지 확인
            Optional<UserResume> existingResume = userResumeRepository.findByUser(user);

            UserResume userResume;
            
       
            
            if (existingResume.isPresent()) {
                // 기존 자기소개서가 있으면 업데이트
                userResume = existingResume.get();
                userResume.setMbti(userResumeDto.getMbti());
                userResume.setHeight(userResumeDto.getHeight());
                userResume.setRegion(userResumeDto.getRegion());
                userResume.setBirthdate(userResumeDto.getBirthdate());
                userResume.setIntroduction(userResumeDto.getIntroduction());
                userResume.setPhoto1(userResumeDto.getPhoto1());
                userResume.setPhoto2(userResumeDto.getPhoto2());
                userResume.setUpdated_at(new Date()); // 수정 시간 업데이트
            
            } else {
                // 기존 자기소개서가 없으면 새로 생성
                userResume = new UserResume();
              
                userResume.setUser(user);
                userResume.setMbti(userResumeDto.getMbti());
                userResume.setHeight(userResumeDto.getHeight());
                userResume.setRegion(userResumeDto.getRegion());
                userResume.setBirthdate(userResumeDto.getBirthdate());
                userResume.setIntroduction(userResumeDto.getIntroduction());
                userResume.setPhoto1(userResumeDto.getPhoto1());
                userResume.setPhoto2(userResumeDto.getPhoto2());
                userResume.setCreated_at(new Date()); // 생성 시간 설정
            }

            // 저장 (업데이트 또는 새로 생성)
            userResumeRepository.save(userResume);

            return "success"; // 성공 메시지
        } catch (Exception e) {
            throw new RuntimeException("Resume save failed: " + e.getMessage()); // 오류 발생 시 예외 처리
        }
    }
}