package com.wsingnal.service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.wsingnal.dto.PhoneRequestDto;
import com.wsingnal.dto.VerifyCodeDto;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;

@Service
public class SmsService {

	@Value("${sms.api.key}")
	private String apiKey;

	@Value("${sms.api.secret}")
	private String apiSecret;

	@Value("${sms.api.sender}")
	private String sender;

	private final RedisTemplate<String, String> redisTemplate;

	public SmsService(RedisTemplate<String, String> redisTemplate) {
		this.redisTemplate = redisTemplate;
		// Coolsms API 초기화

	}

	// 인증 코드 전송
	public void sendVerificationCode(PhoneRequestDto request) {
		String code = generateVerificationCode();
		System.out.println("code: " + code);

		// Redis에 인증 코드 저장 (유효시간: 3분)
		redisTemplate.opsForValue().set(request.getPhone(), code, 3, TimeUnit.MINUTES);

		// 인증 코드 SMS 발송
		sendSms(request.getPhone(), code);
	}

	// 인증 코드 발송 (Coolsms API 호출)
	private void sendSms(String phone, String code) {
		try {
			DefaultMessageService messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret,
					"https://api.coolsms.co.kr");
			// Message 객체 생성
			Message message = new Message();
			message.setTo(phone); // 수신자 번호
			message.setFrom(sender); // 발신자 번호
			message.setText("[웨딩시그널] 본인확인 인증 코드: (" + code+ ") 타인과 공유하지 마세요!"); // 전송할 메시지 내용

			// SMS 전송
			messageService.send(message);
			System.out.println("SMS 전송 성공!");
		} catch (Exception e) {
			System.out.println("SMS 전송 실패: " + e.getMessage());
			throw new RuntimeException("SMS 전송 실패");
		}
	}

	// 인증 코드 생성
	private String generateVerificationCode() {
		Random random = new Random();
		return String.format("%06d", random.nextInt(999999)); // 6자리 인증 코드 생성
	}

	// 인증 코드 검증
	public boolean verifyCode(VerifyCodeDto request) {
		String storedCode = redisTemplate.opsForValue().get(request.getPhone());
		return storedCode != null && storedCode.equals(request.getCode());
	}
}
