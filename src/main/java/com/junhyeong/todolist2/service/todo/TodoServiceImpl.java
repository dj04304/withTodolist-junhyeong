package com.junhyeong.todolist2.service.todo;

import org.springframework.stereotype.Service;

import com.junhyeong.todolist2.domain.todo.Todo;
import com.junhyeong.todolist2.domain.todo.TodoRepository;
import com.junhyeong.todolist2.web.dto.todo.CreateTodoReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{
	
	private final TodoRepository todoRepository;

	@Override
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception {
		Todo todoEntity = createTodoReqDto.toEntity();
		
		return todoRepository.save(todoEntity) > 0;
	}

	
}
