package com.junhyeong.todolist2.domain.todo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Todo {
	private int todo_code;
	private String todo_content;
	private int todo_complete; //실행 완료시에 체크 될 것
	private int importance_flag;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
}
