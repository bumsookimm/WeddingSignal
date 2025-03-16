package com.wsingnal.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wsingnal.dto.PhoneRequestDto;
import com.wsingnal.dto.UserDto;
import com.wsingnal.dto.UserResumeDto;
import com.wsingnal.dto.VerifyCodeDto;
import com.wsingnal.entity.User;
import com.wsingnal.repository.UserRepository;
import com.wsingnal.service.LoginService;
import com.wsingnal.service.PasswordChangeService;
import com.wsingnal.service.ResumeDeleteService;
import com.wsingnal.service.ResumeViewService;
import com.wsingnal.service.SmsService;
import com.wsingnal.service.UserResumeService;
import com.wsingnal.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordChangeService passwordChangeService;

	@Autowired
	private UserResumeService userResumeService;

	@Autowired
	private ResumeViewService resumeViewService;

	@Autowired
	private ResumeDeleteService resumeDeleteService;
	
	
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
	public void logout(HttpSession session, HttpServletResponse response) {
		// 세션 무효화 (로그아웃 처리)
		session.invalidate();

		// JSESSIONID 쿠키 삭제 (세션 쿠키)
		Cookie sessionCookie = new Cookie("JSESSIONID", null);
		sessionCookie.setMaxAge(0); // 즉시 만료
		sessionCookie.setPath("/"); // 전체 경로에 적용
		response.addCookie(sessionCookie);

		// 기타 쿠키 삭제 (예: 로그인 상태를 저장하는 다른 쿠키)
		Cookie otherCookie = new Cookie("otherCookieName", null);
		otherCookie.setMaxAge(0);
		otherCookie.setPath("/");
		response.addCookie(otherCookie);

		// 응답 코드 추가 (옵션)
		response.setStatus(HttpServletResponse.SC_OK); // 상태 코드 200
	}

	@GetMapping("/userInfo")
	public ResponseEntity<User> getUserInfo(HttpSession session) {
		// 세션에서 로그인된 이메일을 가져옴
		String email = (String) session.getAttribute("loginUser");

		if (email == null) {
			return ResponseEntity.status(401).body(null); // Unauthorized
		}

		// 이메일로 사용자 조회
		Optional<User> userOptional = userRepository.findByEmail(email);
		if (userOptional.isPresent()) {
			return ResponseEntity.ok(userOptional.get()); // 사용자 정보 반환
		} else {
			return ResponseEntity.status(404).body(null); // 사용자 미발견
		}
	}

	@PostMapping("/verifyCurrentPassword")
	public ResponseEntity<Map<String, Object>> verifyCurrentPassword(@RequestBody Map<String, String> request,
			HttpSession session) {
		// 세션에서 로그인된 이메일을 가져옴
		String email = (String) session.getAttribute("loginUser");

		// 로그인이 되어 있지 않으면 에러 반환
		if (email == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "로그인이 필요합니다"));
		}

		// 사용자가 입력한 비밀번호
		String password = request.get("currentPassword");

		// 비밀번호 검증
		boolean isPasswordCorrect = passwordChangeService.verifyCurrentPassword(email, password);

		// 비밀번호가 맞으면 성공 응답
		if (isPasswordCorrect) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", true); // 비밀번호 확인 성공
			return ResponseEntity.ok(response);
		}

		// 비밀번호가 틀리면 실패 응답
		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("error", "현재 비밀번호가 올바르지 않습니다");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	}

	@PostMapping("/changePassword")
	public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request,
			HttpSession session) {

		String newPassword = request.get("newPassword");
		String email = (String) session.getAttribute("loginUser");

		String verifyPassword = passwordChangeService.changePassword(newPassword, email);
		if (verifyPassword.equals("성공")) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			return ResponseEntity.ok(response);
		} else {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("error", "현재 비밀번호가 올바르지 않습니다");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
		}
	}

	@PostMapping("/resume/save")
	public ResponseEntity<Map<String, Object>> saveResume(@RequestBody UserResumeDto userResumeDto,
			HttpSession session) {
		String loginUser = (String) session.getAttribute("loginUser");
		System.out.println("loginUser: " + loginUser);
		String result = userResumeService.saveResume(userResumeDto, loginUser);

		System.out.println("userResumeDto: " + userResumeDto);

		Map<String, Object> response = new HashMap<>();
		if (result != null) {
			response.put("success", true);

		} else {
			response.put("success", false);

		}

		return ResponseEntity.ok(response);
	}

	@GetMapping("/resume")
	public ResponseEntity<?> resumeView(HttpSession session) {
		String loginUser = (String) session.getAttribute("loginUser");

		if (loginUser == null) {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("error", "로그인이 필요합니다");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
		}

		List<UserResumeDto> userResume = resumeViewService.resumView(loginUser);

		System.out.println("userResume: " + userResume);

		return ResponseEntity.ok(userResume.get(0));

	}

	@DeleteMapping("resume/delete/{resume_id}")
	public void resumeDelete (@PathVariable int resuem_id){
	
		resumeDeleteService.resumeDelete(resuem_id);
		
	}
	
}
