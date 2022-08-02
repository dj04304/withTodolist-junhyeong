package com.junhyeong.todolist2.web.controller.api;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.junhyeong.todolist2.service.todo.TodoService;
import com.junhyeong.todolist2.web.dto.CMRespDto;
import com.junhyeong.todolist2.web.dto.todo.CreateTodoReqDto;
import com.junhyeong.todolist2.web.dto.todo.TodoListRespDto;
import com.junhyeong.todolist2.web.dto.todo.UpdateTodoReqDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/todolist")
@RequiredArgsConstructor
public class TodoController {

	private final TodoService todoService;
	
	//list 생성 Controller
	@GetMapping("/list/{type}")
	public ResponseEntity<?> getTodoList(@PathVariable String type, @RequestParam int page, @RequestParam int contentCount) {
		List<TodoListRespDto> list = null;
		
		try {
			list = todoService.getTodoList(type, page, contentCount);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1, page + "page list on load failed", page));
		}
		
		return ResponseEntity.ok().body(new CMRespDto<>(1, page + "page list success load", list));
	}

	
	//list 조회 Controller
	@PostMapping("/todo")
	public ResponseEntity<?> addTodo(@RequestBody CreateTodoReqDto createTodoReqDto) {
		
		try {
			if(!todoService.createTodo(createTodoReqDto)) {
				throw new RuntimeException("DataBase Error"); //생성되지 않으면 실행되지 않는다고 오류를 던져준다.
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1, "Adding todo failed", createTodoReqDto));
		}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "success", createTodoReqDto));
	}
	
	//todolist를 했는지 안했는지(complete) 체크
	@PutMapping("/complete/todo/{todoCode}")
	public ResponseEntity<?> setCompleteTodo(@PathVariable int todoCode) {
		boolean status = false;
			try {
				status = todoService.updateTodoComplete(todoCode);
			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.internalServerError().body(new CMRespDto<>(-1, "Update todoComplete failed", status));
			}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "Update todoComplete success", status));
	}
	
	//todolist중에서 중요한것인지 아닌지(importance)
	@PutMapping("/importance/todo/{todoCode}")
	public ResponseEntity<?> setImportanceTodo(@PathVariable int todoCode) {
		boolean status = false;
			try {
				status = todoService.updateTodoImportance(todoCode);
			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.internalServerError().body(new CMRespDto<>(-1, "Update todoImportance failed", status));
			}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "Update todoImportance success", status));
	}
	
	//todolist update Controller
	@PutMapping("/todo/{todoCode}")
	public ResponseEntity<?> setTodo(@PathVariable int todoCode, @RequestBody UpdateTodoReqDto updateTodoReqDto) {
		boolean status = false;
			try {
				updateTodoReqDto.setTodoCode(todoCode);
				status = todoService.updateTodo(updateTodoReqDto);
			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.internalServerError().body(new CMRespDto<>(-1, "Update todoImportance failed", status));
			}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "Update todoImportance success", status));
	}
	
	//todolist delete Controller
	@DeleteMapping("/todo/{todoCode}")
	public ResponseEntity<?> removeTodo(@PathVariable int todoCode) {
		boolean status = false;
			try {
				status = todoService.removeTodo(todoCode);
			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.internalServerError().body(new CMRespDto<>(-1, "delete todoImportance failed", status));
			}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "delete todoImportance success", status));
	}
	
}
