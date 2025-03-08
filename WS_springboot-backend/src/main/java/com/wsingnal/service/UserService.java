package com.wsingnal.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.wsingnal.dto.UserDto;
import com.wsingnal.model.User;
import com.wsingnal.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean registerUser(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            return false; // 이메일이 이미 사용 중
        }

        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(userDto.getPassword()));
        user.setNickname(userDto.getNickname());
        user.setBirthdate(userDto.getBirthdate());
        user.setGender(userDto.getGender());
        user.setPhone(userDto.getPhone());
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());

        userRepository.save(user);
        return true;
    }
}