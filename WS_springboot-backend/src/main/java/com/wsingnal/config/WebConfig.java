package com.wsingnal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:3000")  // React 앱의 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 필요한 HTTP 메소드만 허용
                .allowedHeaders("*")  // 모든 헤더 허용
                .allowCredentials(true);  // 자격 증명 허용
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors()  // CORS 설정 추가
            .and()
            .csrf().disable()  // CSRF 보호 비활성화
            .authorizeRequests()
            .requestMatchers("/api/**").permitAll()  //  API 경로 인증 없이 허용
            .anyRequest().authenticated();  // 나머지 요청은 인증 필요
        return http.build();
    }
}