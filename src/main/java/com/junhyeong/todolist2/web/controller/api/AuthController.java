package com.junhyeong.todolist2.web.controller.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.junhyeong.todolist2.service.auth.PrincipalDetailsSeivice;
import com.junhyeong.todolist2.web.dto.CMRespDto;
import com.junhyeong.todolist2.web.dto.user.UserSignupReqDto;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final PrincipalDetailsSeivice principalDetailsSeivice;
	
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserSignupReqDto userSignupReqDto) {
		boolean status = false;
		
		try {
		status = principalDetailsSeivice.addUser(userSignupReqDto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1, "회원가입 완료", status));
		}
		
		return ResponseEntity.ok().body(new CMRespDto<>(1, "회원가입 완료", status));
	}
	
}
