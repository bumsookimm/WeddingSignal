package com.wsingnal.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "user_resume")
public class UserResume {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private int resumeId;  
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")  // 외래 키 설정
    private User user;  // User 엔티티 참조
	
	
	private String mbti;
	private String region;
	private int height;
	private Date birthdate;
	private String introduction;
	private String photo1;
	private String photo2;
	private Date created_at;
	private Date updated_at;

 
    
    }
