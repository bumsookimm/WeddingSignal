package com.wsingnal.dto;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResumeDto {

	private int resume_id;
	private String user_id;
	private String mbti;
	private String region;
	private int heigh;
	private Date birthdate;
	private String introduction;
	private String photo1;
	private String photo2;
	private Timestamp created_at;
	private Timestamp updated_at;

}
