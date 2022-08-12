package com.junhyeong.todolist2.service.auth;

import com.junhyeong.todolist2.web.dto.user.UsernameCheckReqDto;

public interface AuthService {
	public boolean checkUsername(UsernameCheckReqDto usernameCheckReqDto) throws Exception;
	public boolean signup();
}
