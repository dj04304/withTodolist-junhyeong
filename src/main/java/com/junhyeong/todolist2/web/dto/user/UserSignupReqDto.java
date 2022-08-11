package com.junhyeong.todolist2.web.dto.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.junhyeong.todolist2.domain.user.User;


public class UserSignupReqDto {
	private String name;
	private String email;
	private String username;
	private String password;
	
	public User userEntity() {
		return User.builder()
					.user_name(name)
					.user_email(email)
					.user_id(username)
					.user_password(new BCryptPasswordEncoder().encode(password))
					.user_roles("ROLE_USER, ROLE_MANAGER")
					.build();
	}
}
