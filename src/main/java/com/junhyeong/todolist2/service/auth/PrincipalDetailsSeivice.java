package com.junhyeong.todolist2.service.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.junhyeong.todolist2.domain.user.User;
import com.junhyeong.todolist2.domain.user.UserRepository;
import com.junhyeong.todolist2.web.dto.user.UserSignupReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsSeivice implements UserDetailsService{

	private final  UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User userEntity = null;
		
		try {
			 userEntity = userRepository.findUserByUsername(username);			 
		} catch (Exception e) {
			e.printStackTrace();
			throw new UsernameNotFoundException(username);
		}
		if(userEntity == null) {
			throw new UsernameNotFoundException(username + "사용자 이름을 찾을 수 없습니다.");
		}
		
		return new PrincipalDetails(userEntity);
	}

	public boolean addUser(UserSignupReqDto userSignupReqDto) throws Exception{
		return userRepository.save(userSignupReqDto.userEntity()) > 0;
	}
	
}
