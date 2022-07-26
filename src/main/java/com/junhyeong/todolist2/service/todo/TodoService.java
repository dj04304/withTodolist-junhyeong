package com.junhyeong.todolist2.service.todo;

import java.util.List;

import com.junhyeong.todolist2.web.dto.todo.CreateTodoReqDto;
import com.junhyeong.todolist2.web.dto.todo.TodoListRespDto;

public interface TodoService {
	//추가
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception;
	//수정
	//삭제
	//조회
	public List<TodoListRespDto> getTodoList(int page, int contentCount)throws Exception;
}
