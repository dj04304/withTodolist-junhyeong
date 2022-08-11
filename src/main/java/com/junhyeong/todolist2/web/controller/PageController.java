package com.junhyeong.todolist2.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/todolist")
public class PageController {
	
	@GetMapping({"/", "/index"})
	public String loadIndex() {
		return "index";
	}
	
	@GetMapping("/login")
	public String signin() {
		return "/auth/signin";
	}
	
	@GetMapping("/signup")
	public String signup() {
		return "/auth/signup";
	}
	
}
