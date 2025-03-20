package com.wsingnal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wsingnal.entity.UserResume;
import com.wsingnal.repository.UserResumeRepository;

@Service
public class ResumeDeleteService {

	@Autowired
	private UserResumeRepository userResumeRepository;
	
	
	public boolean resumeDelete(int resume_id) {
		
    Optional<UserResume> resume = userResumeRepository.findByResumeId(resume_id);
		
    if(!resume.isPresent()) {
    	
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "자기소개서를 찾을 수 없습니다.");
    }
    
    userResumeRepository.delete(resume.get());
    
    return true;
    
	}
}
