package com.junhyeong.todolist2.domain.todo;

import java.time.LocalDateTime;

import com.junhyeong.todolist2.web.dto.todo.TodoListRespDto;

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
	private int total_count;
	private int incomplete_count;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	public TodoListRespDto toListDto() {
		return TodoListRespDto.builder()
				.todoCode(todo_code)
				.todo(todo_content)
				.todoComplete(todo_complete == 1)
				.importance(importance_flag == 1)
				.totalCount(total_count)
				.incompleteCount(incomplete_count)
				.createDate(create_date)
				.updateDate(update_date)
				.build();
	}
	
}
