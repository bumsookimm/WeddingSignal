package com.wsingnal;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.wsingnal.dao")
public class WsingnalApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsingnalApplication.class, args);
	}

}