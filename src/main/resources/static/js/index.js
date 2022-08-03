const selectedTypeButton = document.querySelector(".selected-type-button");
const typeSelectBoxList = document.querySelector(".type-select-box-list");
const typeSelectBoxListLis = typeSelectBoxList.querySelectorAll("li");
const todoContentList = document.querySelector(".todo-content-list");
const sectionBoby = document.querySelector(".section-body");
const incompleteCountNumber = document.querySelector(".incomplete-count-number");


let page = 1;
let totalPage = 0;

sectionBoby.onscroll = () => {
	console.log(sectionBoby.scrollTop)
	let checkNum = todoContentList.clientHeight - sectionBoby.offsetHeight - sectionBoby.scrollTop;
	
	if(checkNum < 1 && checkNum > -1 && page < totalPage){
		console.log(page);
		console.log(totalPage);
		page++;
		load();
	}
}

let listType = "all";

load();

selectedTypeButton.onclick = () => {
    typeSelectBoxList.classList.toggle("visible");
}


for(let i = 0; i < typeSelectBoxListLis.length; i++){
	
	typeSelectBoxListLis[i].onclick = () => {
		page = 1;
		
		for(let i = 0; i < typeSelectBoxListLis.length; i++){
			typeSelectBoxListLis[i].classList.remove("type-selected");
		}
		
		const selectedType = document.querySelector(".selected-type");
		
		typeSelectBoxListLis[i].classList.add("type-selected");
		
		listType = typeSelectBoxListLis[i].textContent.toLowerCase();
		
		selectedType.textContent = typeSelectBoxListLis[i].textContent;
		
		todoContentList.innerHTML = "";
		
		load();
		
		typeSelectBoxList.classList.toggle("visible");
		
	}
	
}


function load() {
	$.ajax({
		type: "get",
		url: `/api/v1/todolist/list/${listType}`,
		data: {
			"page": page,
			contentCount: 20
		},
		dataType: "json",
		success: (response) => {
			getList(response.data);
		},
		error: errorMessage
		
	})
}

function setTotalCount(totalCount){
	totalPage = totalCount % 20 == 0 ? totalCount / 20 : Math.floor(totalCount / 20) + 1;
}

function getList(data) {
	incompleteCountNumber.textContent = data[0].incompleteCount;
	setTotalCount(data[0].totalCount);
	for(let content of data) {
		const listContent = `
			<li class="todo-content">
                <input type="checkbox" id="complete-check-${content.todoCode}" class="complete-check" ${content.todoComplete ? 'checked' : ''}>
                <label for="complete-check-${content.todoCode}"></label>
                <div class="todo-content-text">${content.todo}</div>
                <input type="text" class="todo-content-input visible" value="${content.todo}">
                <input type="checkbox" id="importance-check-${content.todoCode}" class="importance-check" ${content.importance ? 'checked' : ''}>
                <label for="importance-check-${content.todoCode}"></label>
                <div class="trash-button"><i class="fa-solid fa-trash"></i></div>
            </li>
		`
		todoContentList.innerHTML += listContent;
	}
	
	addEvent();
}

function addEvent() {
	const todoContents = document.querySelectorAll(".todo-content");
	
	for(let i = 0; i < todoContents.length; i++){
		let todoCode = todoContents[i].querySelector(".complete-check").getAttribute("id");
		let index = todoCode.lastIndexOf("-");
		todoCode = todoCode.substring(index + 1);
		
		todoContents[i].querySelector(".complete-check").onchange = () => {
			let incompleteCount = parseInt(incompleteCountNumber.textContent)
			
			if(todoContents[i].querySelector(".complete-check").checked){
				incompleteCountNumber.textContent = incompleteCount - 1;
			}else {
				incompleteCountNumber.textContent = incompleteCount + 1;
			}
			updateCheckStatus("complete", todoContents[i], todoCode);
		}
		
		todoContents[i].querySelector(".importance-check").onchange = () => {
			updateCheckStatus("importance", todoContents[i], todoCode);
		}
		
		todoContents[i].querySelector(".trash-button").onclick = () => {
			deleteTodo(todoContents[i], todoCode);
		}
		
		const todoContentText = todoContents[i].querySelector(".todo-content-text");
		const todoContentInput = todoContents[i].querySelector(".todo-content-input");
		let todoContentValue = null;
		
		//엔터 이벤트가 일어났을 때, onkeyup 이후 onblur가 실행되어 두번 실행되기 때문에, eventFlag 사용
		let eventFlag = false;
		
		//리스트 input 내 클릭시 수정
		//e 는 자기자신(todoContentText)을 가리킨다.
		todoContentText.onclick = () => {
			todoContentValue = todoContentInput.value;
			todoContentText.classList.toggle("visible");
			todoContentInput.classList.toggle("visible");
			todoContentInput.focus();
			eventFlag = true;
		}
		
		let updateTodoContent = () => {
			if(todoContentValue != todoContentInput.value){
						$.ajax({
							type: "put",
							url: `/api/v1/todolist/todo/${todoCode}`,
							contentType: "application/json", 
							data: JSON.stringify({
								"todoCode": todoCode,
								todo: todoContentInput.value
								}),
							async: false,
							dataType: "json",
							success: (response) => {
								if(response.data) {
									todoContentText.textContent = todoContentInput.value;
								}
							},
							error: errorMessage
						})
				}
				todoContentText.classList.toggle("visible");
				todoContentInput.classList.toggle("visible");
		}
		
		//input 에서 포커스가 사라졌을 때
		todoContentInput.onblur = () =>{
			if(eventFlag){
					//내용이 바꼈을 때
				updateTodoContent();
			}
			
		}
		
		todoContentInput.onkeyup = () => {
			if(window.event.keyCode == 13){
				eventFlag = false;
				updateTodoContent();
			}
			
		}
		
	}
	
}


function updateStatus(type, todoCode) {
	result = false;
	
	$.ajax({
		type: "put",
		url: `/api/v1/todolist/${type}/todo/${todoCode}`,
		async: false,
		dataType: "json",
		success: (response) => {
			result = response.data
			
		},
		error: errorMessage
	})
	return result;
}

function updateCheckStatus(type, todoContent, todoCode) {
	let result = updateStatus(type, todoCode);
	
	if(
			(
				(
					type == "complete" 
					&& 
					(listType == "complete" || listType == "incomplete")
				) 
				|| 
				(type == "importance" && listType == "importance")
			) 
			&& 
			result
		) {
		todoContentList.removeChild(todoContent);
	}
}

function deleteTodo(todoContent, todoCode) {
	$.ajax({
		type: "delete",
		url: `/api/v1/todolist/todo/${todoCode}`,
		async: false,
		dataType: "json",
		success: (response) => {
			if(response.data){
				todoContentList.removeChild(todoContent);
			}
		},
		error: errorMessage
	})
}

function errorMessage(request, status, error) {
	alert("요청 실패");
	console.log(request.status);
	console.log(request.responseText);
	console.log(error);
}

