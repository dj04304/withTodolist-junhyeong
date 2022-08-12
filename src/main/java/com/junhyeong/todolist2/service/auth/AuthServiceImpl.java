package com.junhyeong.todolist2.service.auth;

import org.springframework.stereotype.Service;

import com.junhyeong.todolist2.domain.user.UserRepository;
import com.junhyeong.todolist2.web.dto.user.UsernameCheckReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

	private final UserRepository userRepository;
	
	@Override
	public boolean checkUsername(UsernameCheckReqDto usernameCheckReqDto) throws Exception {
		
		return userRepository.findUserByUsername(usernameCheckReqDto.getUsername()) == null; //null 이면 가입 가능
	}

	@Override
	public boolean signup() {
		return false;
	}

}
