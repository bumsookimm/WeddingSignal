package com.wsingnal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wsingnal.entity.User;
import com.wsingnal.entity.UserResume;

@Repository
public interface UserResumeRepository extends JpaRepository<UserResume, Integer> {

	Optional<UserResume> findByUser(User user);
	Optional<UserResume> findByResumeId(int resume_id);
}