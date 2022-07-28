package com.junhyeong.todolist2.service.todo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.junhyeong.todolist2.domain.todo.Todo;
import com.junhyeong.todolist2.domain.todo.TodoRepository;
import com.junhyeong.todolist2.web.dto.todo.CreateTodoReqDto;
import com.junhyeong.todolist2.web.dto.todo.TodoListRespDto;
import com.junhyeong.todolist2.web.dto.todo.UpdateTodoReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{
	
	private final TodoRepository todoRepository;

	
	// todolist 생성
	@Override
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception {
		Todo todoEntity = createTodoReqDto.toEntity();
		String content = todoEntity.getTodo_content();
//		for(int i = 200; i < 1000; i++) {
//			todoEntity.setTodo_content(content + "_" + (i + 1));
//			if(i % 2 == 0) {
//				todoEntity.setImportance_flag(1);
//			}else {
//				todoEntity.setImportance_flag(0);
//			}
//			todoRepository.save(todoEntity);
//		}
//		return true;
		
		return todoRepository.save(todoEntity) > 0;
	}
	
	//list 조회
	
	@Override
	public List<TodoListRespDto> getTodoList(String type, int page, int contentCount) throws Exception {
		
		
		List<Todo> todoList = todoRepository.getTodoList(createGetTodoListMap(type, page, contentCount));
		
		
		return createTodoListRespDtos(todoList);
	}
	
	//update todoComplete 
	@Override
	public boolean updateTodoComplete(int todoCode) throws Exception {
		return todoRepository.updateTodoComplete(todoCode) > 0;
	}
	
	//update todoImportance
	@Override
	public boolean updateTodoImportance(int todoCode) throws Exception {
		return todoRepository.updateTodoImportance(todoCode) > 0;
	}
	
	//todolist 수정
	@Override
	public boolean updateTodo(UpdateTodoReqDto updateTodoReqDto) throws Exception {
		return todoRepository.updateTodoByTodoCode(updateTodoReqDto.toEntity()) > 0;
	}
	
	//todolist 삭제
	@Override
	public boolean removeTodo(int todoCode) throws Exception {
		return todoRepository.remove(todoCode) > 0;
	}
	

	//중복된 것들을 정리해주는 역할 (리팩토링)
	private Map<String, Object> createGetTodoListMap(String type, int page, int contentCount) {
		Map<String, Object> map = new HashMap<String, Object>(); //index key값으로 원하는 페이지 수만큼을 가져온다.(contentCount)
		map.put("type", type);
		map.put("index", (page -1) * contentCount);//count key값으로 count를 알려줌
		map.put("count", contentCount);
		
		return map;
	}
	
	private List<TodoListRespDto> createTodoListRespDtos(List<Todo> todoList) {
		List<TodoListRespDto> todoListRespDtos = new ArrayList<TodoListRespDto>();
		
		todoList.forEach(todo -> {
			todoListRespDtos.add(todo.toListDto());
		});
		
		return todoListRespDtos;
		
	}
	
}
