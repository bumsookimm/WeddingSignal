package com.wsingnal.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.wsingnal.dto.UserResumeDto;
import com.wsingnal.entity.User;
import com.wsingnal.entity.UserResume;
import com.wsingnal.repository.UserRepository;
import com.wsingnal.repository.UserResumeRepository;

@Service
public class ResumeSaveService {

    @Autowired
    private UserResumeRepository userResumeRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "src/main/resources/static/images/";

    public String saveResume(UserResumeDto userResumeDto, String loginUser, MultipartFile photo1, MultipartFile photo2) {
        if (loginUser == null) {
            throw new RuntimeException("Login user is null");
        }

        Optional<User> email = userRepository.findByEmail(loginUser);

        if (!email.isPresent()) {
            throw new RuntimeException("User not found for email: " + loginUser);
        }

        User user = email.get();

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

                // 사진 업로드 처리 (MultipartFile로 받은 파일 처리)
                if (photo1 != null && !photo1.isEmpty()) {
                    String photo1Path = saveFile(photo1); // MultipartFile로 파일을 저장
                    userResume.setPhoto1(photo1Path);
                }

                if (photo2 != null && !photo2.isEmpty()) {
                    String photo2Path = saveFile(photo2); // MultipartFile로 파일을 저장
                    userResume.setPhoto2(photo2Path);
                }

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

                // 사진 업로드 처리 (MultipartFile로 받은 파일 처리)
                if (photo1 != null && !photo1.isEmpty()) {
                    String photo1Path = saveFile(photo1); // MultipartFile로 파일을 저장
                    userResume.setPhoto1(photo1Path);
                }

                if (photo2 != null && !photo2.isEmpty()) {
                    String photo2Path = saveFile(photo2); // MultipartFile로 파일을 저장
                    userResume.setPhoto2(photo2Path);
                }

                userResume.setCreated_at(new Date()); // 생성 시간 설정
            }

            // 저장 (업데이트 또는 새로 생성)
            userResumeRepository.save(userResume);

            return "success"; // 성공 메시지
        } catch (Exception e) {
            throw new RuntimeException("Resume save failed: " + e.getMessage()); // 오류 발생 시 예외 처리
        }
    }

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty or null");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new RuntimeException("File name is invalid");
        }

        // 파일 확장자 추출
        String extension = fileName.substring(fileName.lastIndexOf("."));

        // UUID로 고유한 파일 이름 생성
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        // 파일을 지정된 디렉토리에 저장
        Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        // 파일 경로를 리턴
        return  uniqueFileName; // 웹에서 접근할 수 있는 경로
    }
}
