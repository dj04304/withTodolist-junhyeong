package com.junhyeong.todolist2.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.junhyeong.todolist2.config.auth.AuthFailureHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.authorizeRequests()
				.antMatchers("/", "/api/v1/todolist/**", "/todolist/", "/todolist/index")
				.authenticated()
				
				.anyRequest()
				.permitAll()
				.and()
				.formLogin()
				.loginPage("/todolist/login")
				.loginProcessingUrl("/todolist/signin")
				.failureHandler(new AuthFailureHandler())
				.defaultSuccessUrl("/todolist/");
	}
}
