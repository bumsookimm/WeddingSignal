package com.wsingnal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wsingnal.entity.UserResume;
import com.wsingnal.repository.UserResumeRepository;

@Service
public class ResumeDeleteService {

	@Autowired
	private UserResumeRepository userResumeRepository;
	
	
	public void resumeDelete(int resume_id) {
		
    Optional<UserResume> resume = userResumeRepository.findByResumeId(resume_id);
		
    userResumeRepository.delete(resume.get());
    
    
	}
}
