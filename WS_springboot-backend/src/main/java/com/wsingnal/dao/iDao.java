package com.wsingnal.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wsingnal.dto.UserResumeDto;

@Mapper
public interface iDao {

	List<UserResumeDto> showResume (String email);
}
