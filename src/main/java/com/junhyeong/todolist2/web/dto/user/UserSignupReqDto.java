package com.junhyeong.todolist2.web.dto.user;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.junhyeong.todolist2.domain.user.User;

import lombok.Data;


@Data
public class UserSignupReqDto {
	@NotBlank
	@Pattern(regexp = "^[a-zA-Z]{1}[a-zA-Z0-9_]{4,12}$", message = "첫 글자는 영문으로 해주세요")
	private String username;
	
	@NotBlank
	@Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[-~!@#$%^&*_+=])[a-zA-Z\\d-~!@#$%^&*_+=]{8,16}",
						message = "비밀번호는 8자이상 16자 이하여야 합니다.")
	private String password;
	
	@NotBlank
	@Pattern(regexp = "^[가-힇]*$", message = "한글만 입력 가능합니다.")
	private String name;
	
	@NotBlank
	@Email
	private String email;
	
	@AssertTrue(message = "아이디 중복확인이 되지 않았습니다.")
	private boolean checkUsernameFlag;
	
	public User userEntity() {
		return User.builder()
					.user_id(username)
					.user_password(new BCryptPasswordEncoder().encode(password))
					.user_name(name)
					.user_email(email)
					.user_roles("ROLE_USER")
					.build();
	}
}
