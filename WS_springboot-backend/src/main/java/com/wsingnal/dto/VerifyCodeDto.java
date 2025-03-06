package com.wsingnal.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyCodeDto {
	private String phone;
	private String code;
}
