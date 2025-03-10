package com.wsingnal.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wsingnal.dto.PhoneRequestDto;
import com.wsingnal.dto.UserDto;
import com.wsingnal.dto.VerifyCodeDto;
import com.wsingnal.service.LoginService;
import com.wsingnal.service.SmsService;
import com.wsingnal.service.UserService;

import jakarta.servlet.http.HttpSession;

@RequestMapping("/api")
@RestController
public class WSignalController {

	@Autowired
	private UserService userService;

	@Autowired
	private SmsService smsService;

	@Autowired
	private LoginService loginService;

	@PostMapping("/signup")
	public ResponseEntity<String> signUp(@RequestBody UserDto userDto) {

		// 회원가입 메서드 호출
		String result = userService.registerUser(userDto);

		// 결과 메시지에 따라 ResponseEntity 설정
		if (result.equals("회원가입 성공!")) {
			return ResponseEntity.ok(result); // 회원가입 성공
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result); // 중복된 이메일 또는 전화번호
		}
	}

	// 인증 코드 전송 API
	@PostMapping("/sendVerificationCode")
	public ResponseEntity<String> sendVerificationCode(@RequestBody PhoneRequestDto request) {

		try {
			System.out.println("requset" + request.getPhone());
			smsService.sendVerificationCode(request);
			return ResponseEntity.ok("인증 코드가 전송되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("인증 코드 전송에 실패했습니다.");
		}
	}

	// 인증 코드 확인 API
	@PostMapping("/verifyCode")
	public ResponseEntity<String> verifyCode(@RequestBody VerifyCodeDto request) {
		if (smsService.verifyCode(request)) {
			return ResponseEntity.ok("인증 성공");
		} else {
			return ResponseEntity.status(400).body("인증 코드가 일치하지 않습니다.");
		}
	}

	// 폰넘버 확인 API
	@PostMapping("/checkPhoneNumber")
	public String checkPhoneNumber(@RequestBody Map<String, String> request) {
		String phone = request.get("phone");
		return userService.checkPhoneNumber(phone);
	}

	// 로그인 아이디/비밀번호 확인 API
	@PostMapping("/checkLogin")
	public ResponseEntity<String> checkLogin(@RequestBody Map<String, String> request, HttpSession session) {
		String email = request.get("email");
		String password = request.get("password");

		String result = loginService.checkLogin(email, password);

		if ("SUCCESS".equals(result)) {
			session.setAttribute("loginUser", email);
			System.out.println("세션에 저장: " + session.getAttribute("loginUser"));
			return ResponseEntity.ok("SUCCESS");
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("FAIL");
		}
	}

	// 로그인 상태 확인 API
	@GetMapping("/checkLoginStatus")
	public ResponseEntity<String> checkLoginStatus(HttpSession session) {
	    // 세션에 "loginUser"가 존재하면 로그인된 상태
	    String loginUser = (String) session.getAttribute("loginUser");
	    System.out.println("세션에서 가져옴 : " + loginUser);
	    if (loginUser != null) {
	        return ResponseEntity.ok("LOGGED_IN"); // 로그인된 상태
	    } else {
	        return ResponseEntity.ok("LOGGED_OUT"); // 로그아웃 상태
	    }
	}
	
	@GetMapping("/logout")
	public static void logout(HttpSession session) {
		// 세션 무효화 (로그아웃 처리)
		session.invalidate();
		
	}
}
