package com.junhyeong.todolist2.config.auth;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class AuthFailureHandler implements AuthenticationFailureHandler{

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		
		System.out.println(exception.getMessage());
		
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html; charset= utf-8;");
		response.getWriter().print("<html><head></head><body><script>alert(\"로그인 실패\\n  정보를 확인하세요\"); history.back();</script></body></html>");
		
	}

}
