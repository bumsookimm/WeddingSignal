package com.wsingnal.model;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    private String email;
    private String password;
    private String nickname;
    private Date birthdate;
    private String gender;
    private String phone;
    private Date createdAt;
    private Date updatedAt;

 
    
    @PrePersist
    public void generateUUID() {
        this.id = UUID.randomUUID().toString();  // UUID 자동 생성
    }
}