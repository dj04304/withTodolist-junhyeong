package com.junhyeong.todolist2.web.dto.user;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;
import lombok.NonNull;

@Data
public class UsernameCheckReqDto {

	@NotBlank
	@Size(max = 16, min = 4, message = "4자 이상 16자 이하로 입력해주세요")
	private String username;
	
}
