package com.wsingnal.service;

import java.util.ArrayList;
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
        // 이력서가 없을 경우 빈 리스트 반환
        return (userResumes == null || userResumes.isEmpty()) ? new ArrayList<>() : userResumes;
    }

}
