package com.junhyeong.todolist2.service.todo;

import com.junhyeong.todolist2.web.dto.todo.CreateTodoReqDto;

public interface TodoService {
	//추가
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception;
	//수정
	//삭제
	//조회
}
