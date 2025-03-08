package com.wsingnal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wsingnal.dto.UserDto;
import com.wsingnal.service.UserService;

@CrossOrigin(origins = "http://localhost:3000")  // React 앱에서 오는 요청 허용
@RestController
public class WSignalController {

    @Autowired
    private UserService userService;
   
    @PostMapping("/api/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDto UserDTO) {
        System.out.println(UserDTO);  // 로그 출력
        boolean success = userService.registerUser(UserDTO);
        if (success) {
            return ResponseEntity.ok("회원가입 성공!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용 중인 이메일입니다.");
        }
    }
}
