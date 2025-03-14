package com.wsingnal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wsingnal.model.UserResume;

@Repository
public interface UserResumeRepository extends JpaRepository<UserResume, Integer> {

}