package com.junhyeong.todolist2.domain.todo;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TodoRepository {
	public int save(Todo todo) throws Exception;
}
