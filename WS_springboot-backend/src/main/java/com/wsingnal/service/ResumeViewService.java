package com.wsingnal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wsingnal.dao.IDao;
import com.wsingnal.dto.UserResumeDto;

@Service
public class ResumeViewService {

	@Autowired
	private IDao idao;

	public List<UserResumeDto> resumView(String loginUser) {
		List<UserResumeDto> userResumes = idao.showResume(loginUser);
		if (userResumes == null || userResumes.isEmpty()) {
			throw new RuntimeException("No resume found for the given user.");
		}
		return userResumes;
	}

}
