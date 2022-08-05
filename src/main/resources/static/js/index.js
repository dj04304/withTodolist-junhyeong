const selectedTypeButton = document.querySelector(".selected-type-button");// select 버튼
const typeSelectBoxList = document.querySelector(".type-select-box-list"); //listType 전체
const typeSelectBoxListLis = typeSelectBoxList.querySelectorAll("li"); // listType (all, importance, complete, incomplete)
const todoContentList = document.querySelector(".todo-content-list"); //list 내용이 들어갈 공간
const sectionBoby = document.querySelector(".section-body"); //list의 높이
const incompleteCountNumber = document.querySelector(".incomplete-count-number"); //완료되지 않은 일
const modalContainer = document.querySelector(".modal-container");
const todoAddButton = document.querySelector(".todo-add-button");

/* 
	게시글 불러오기
	
	1. todoList의 type이  무엇인지가 중요함.
		-all
		-importance
		-complete
		-incomplete
		
	2. 요청주소: /api/v1/todolist/list/{type}?page=페이지 번호& contentCount=게시글의 개수
	
	3.AJAX 요청을 활용
			-type: get
			-url: 요청주소
			-data: page, contentCount 객체 -> {key: value} (json은 아님, 일반 javascript의 object임) -> {page: 1, contentCount: 20}
			-dataType: 응답받을 데이터의 타입 -> 기본적으로는 Text,  우리는 "json"으로 받는다. 왜? CMRespDto로 날아오는 것이 json의 형태이다.
			-success: 함수 -> response 매개변수를 받아야함. response에는 CMResponse가 들어온다.
			-error: 함수 -> 요청실패시에 error가 뜬다. 400, 500
							-400 에러의 경우
								-매개변수 타입이 잘못된 경우
								-요청 리소스가 잘못된 경우 (NOT FOUND)
								-권한이 없어서 요청을 하지 못하는 경우
								-contentType
									- test/html
									- text/plain
									- application/json
								-enctype : multipart/form-data -> 이미지 업로드 (contentType이랑은 다름)
							-500 에러의 경우
								- 가장 먼저 해야하는 것 > springFramwork console창 에러의 가장 위쪽이면서 가장 오른쪽 확인
								-오타
								- nullponinter
								- sql
								- indexOut
								- di 잘못했을 때 
								- @component(Controller, RestController, Service, Mapper, Repository, Configuration) IoC에 등록 안했을 때,
								- Interface 겹칠 때, Bean 객체가 IoC에 여러 개 생성되어 있을 때 
							
*/

//DB에 있는 전체 페이지
let totalPage = 0;
//DB에서 가져올 페이지: 항상 1이 되어야 한다.
let page = 1;
//listType = all, complete, incomplete, importance
let listType = "all";

//실행
load();

//20개씩 가져오기 때문에 20으로 딱 나누어 떨어지면 20으로 나눠서 들고오고, 그렇지 않다면 소숫점을 버리고 1을 더해줌으로써 나머지
//페이지도 가져올 수 있다.
function setTotalPage(totalCount){
	totalPage = totalCount % 20 == 0 ? totalCount / 20 : Math.floor(totalCount / 20) + 1;
}

function setIncompleteCount(incompleteCount) {
	//완료되지 않은 일의 count 를 첫번째 data에서 가져온다.(incompleteCount는 다 똑같이 들고있기 때문에)
	incompleteCountNumber.textContent = incompleteCount;
}

function appendList(listContent) {
	//todo-content-list (ul태그) 안에 반복문으로 담은 내용을 넣어준다.
	todoContentList.innerHTML += listContent
}

//type에 따른 변화에 대한 수식 complete, incomlete, importance
function updateCheckStatus(type, todoContent, todoCode) {
	let result = updateStatus(type, todoCode);
	//result는 항상 true이다.(값이 전달되고 있기 때문)
	console.log(result);
	
	//주요텍스트 > todolist 삼항연산자 공부 메모장 참고
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

function addCompleteEvent(todoContent, todoCode) {
	const completeCheck = todoContent.querySelector(".complete-check");
	
	//첫번째 input (complete-check (체크모양)) 의 속성 변화 이벤트
		completeCheck.onchange = () => {
			// 완료되지 않은 수도 체크의 유무에 따라 수가 변하게끔 해주는 수식
				//완료되지 않은 수를 먼저 int로 형 변환해준다.
			let incompleteCount = parseInt(incompleteCountNumber.textContent);
			
			//체크의 유무에 따라 수가 변함
			if(completeCheck.checked){
				//체크했을 때 완료되었기 때문에 완료하지 않은 일의 수를 -1 해줌
				incompleteCountNumber.textContent = incompleteCount - 1;
			}else {
				//체크했을 때 완료되지 않았기 때문에 완료하지 않은 일의 수를 +1 해줌
				incompleteCountNumber.textContent = incompleteCount + 1;
			}
			//updateCheckStatus메소드(type, todoContents내용, 리스트의 index번호) 호출
			updateCheckStatus("complete", todoContent, todoCode);
		}
}

function addImportanceEvent(todoContent, todoCode) {
	const importanceCheck = todoContent.querySelector(".importance-check");
	//두번째 input(importance-check (별모양)) 의 속성 변화 이벤트
		importanceCheck.onchange = () => {
			//updateCheckStatus메소드(type, todoContents내용, 리스트의 index번호)
			updateCheckStatus("importance", todoContent, todoCode);
		}
}

function addDeleteEvent(todoContent, todoCode) {
	const trashButton = todoContent.querySelector(".trash-button");
	//마지막 버튼(trash-button)을 클릭했을 때, 리스트가 삭제되는 이벤트 
		trashButton.onclick = () => {
			deleteTodo(todoContent, todoCode);
		}
}

function addContentInputEvent(todoContent, todoCode) {
		const todoContentText = todoContent.querySelector(".todo-content-text");	//list 의 텍스트
		const todoContentInput = todoContent.querySelector(".todo-content-input");	//텍스트를 수정할 수 있게끔 해놓은 input태그
		let todoContentOldValue = null;
		
		//엔터 이벤트가 일어났을 때, onkeyup 이후 onblur가 실행되어 두번 실행되기 때문에, eventFlag 사용
		let eventFlag = false;
		
		
		//텍스트내용 수정 이벤트
		let updateTodo = () => {
			let todoContentNewValue = todoContentInput.value;
				//input의 내용이 바뀐게 참이라면 ajax로 전달하여 값을 수정
				if(getChangeStatusOfValue(todoContentOldValue, todoContentNewValue)){
						//내용이 바꼈을 때
						if(updateTodoContent(todoCode, todoContentNewValue)){
							todoContentText.textContent = todoContentNewValue;
						}
				}		
				//내용이 수정되었으면 토글로 커서 및 input을 없애줘야 한다.
				todoContentText.classList.toggle("visible");
				todoContentInput.classList.toggle("visible");
		}
		
		//리스트 input 내 클릭시 수정
		todoContentText.onclick = () => {
			//null 이 들어가있는 todoContentValue 변수에 todoContentInput안에있는 value를 넣어줌
			todoContentValue = todoContentInput.value;
			//input 과 text를 같이 토글효과를 준다.
			todoContentText.classList.toggle("visible");
			todoContentInput.classList.toggle("visible");
			//클릭시에 커서 활성화
			todoContentInput.focus();
			eventFlag = true;
		}
		
		//input 에서 포커스가 사라졌을 때
		todoContentInput.onblur = () =>{
			//엔터 이후 한번 더 작동하는것을 막기위해 onkeyup 함수에서 eventFlag를 flase로 해주고,
			//false가 걸려있기 때문에 onblur는 엔터이후 작동하지 않는다.
			if(eventFlag){
				updateTodo();
			}
		}
		//input내용을 수정하고 엔터를 눌렀다가 땠을 때
		todoContentInput.onkeyup = () => {
			if(window.event.keyCode == 13){
				eventFlag = false;
				updateTodo();
			}
			
		}
}

function getChangeStatusOfValue(originValue, newValue) {
	return originValue != newValue;
}



function substringTodoCode(todoContent) {
	const completeCheck = todoContent.querySelector(".complete-check");
	
	const todoCode = completeCheck.getAttribute("id");
	//console.log("id: " + todoCode); //id: complete-check- (todoCode 번호)
	
	//마지막 하이픈의 위치를 index에 담아준다.
	const tokenIndex = todoCode.lastIndexOf("-");
	//마지막 하이픈("-")뒤의 숫자를 가져오기 위해 substring 에서 + 1을 하여 위치를 추출
	return todoCode.substring(tokenIndex + 1);
}

//수정 및 삭제 이벤트
function addEvent() {
	//todoContentList 안에 담아준 내용(data로 들고 온 내용들)
	const todoContents = document.querySelectorAll(".todo-content");
	
	for(let todoContent of todoContents){
		const todoCode = substringTodoCode(todoContent);

		addCompleteEvent(todoContent, todoCode);
		addImportanceEvent(todoContent, todoCode);
		addDeleteEvent(todoContent, todoCode);
		addContentInputEvent(todoContent, todoCode);
	}
}

//load에서 data를 전달할 내용
function createList(todoList) {
	
	//todo-content-list 에 들어갈 내용을 반복문으로 돌려서 data에서 꺼내 content라는 변수에 하나씩 넣어준다.
	for(let content of todoList) {
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
		
		appendList(listContent);
	}
	//이벤트 호출
	addEvent();
}

//list목록을 스크롤 했을 때의 이벤트
sectionBoby.onscroll = () => {
	//console.log("sectionBody: " + sectionBody.offsetHeight);
	//console.log("scrollTop: " + sectionBody.scrollTop);
	//console.log("todoContentList: " + todoContentList.offsetHeight); //전체길이
	console.log(sectionBoby.scrollTop)
	
	//스크롤의 길이 / chckNum의 값은 오차 범위 1 ~ -1 사이 이다.
	let checkNum = todoContentList.clientHeight - sectionBoby.offsetHeight - sectionBoby.scrollTop;
	
	//오차범위를 잡아주는 수식
	if(checkNum < 1 && checkNum > -1 && page < totalPage){
		console.log(page);
		console.log(totalPage);
		page++;
		load();
	}
}

//select 버튼 클릭시, listType 메뉴의 토글이벤트
selectedTypeButton.onclick = () => {
    typeSelectBoxList.classList.toggle("visible");
}

function resetPage() {
	page = 1;
}

function removeAllClassList(elements, className) {
	//select 버튼내에서 선택된 리스트를 먼저 제거해준다.(색깔로 구분됨)
		for(let elment of elements){
			elment.classList.remove(className);
		}
}

function setListType(selectedType) {
	//listType이 대문자로 되어있기 때문에, 소문자로 변환해줘서 전달해준다.
		listType = selectedType.toLowerCase();
}

function clearTodoContentList() {
	//todoContentList안의 내용을 한번 비워주고 load한다.
		todoContentList.innerHTML = "";
}

for(let i = 0; i < typeSelectBoxListLis.length; i++){
	
	//select 버튼 내의 리스트 클릭시 이벤트
	typeSelectBoxListLis[i].onclick = () => {
		//page를 1로 초기화해줘야, 다른 리스트를 클릭했을 때, 다시 위에서부터 가져온다.
		resetPage();
		
		removeAllClassList(typeSelectBoxListLis, "type-selected");
		
		//select 버튼내에서 선택된 리스트에 클래스를 추가해준다..(색깔로 구분됨)
		typeSelectBoxListLis[i].classList.add("type-selected");
		
		setListType(typeSelectBoxListLis[i].textContent);
		
		//현재 선택된 listType
		const selectedType = document.querySelector(".selected-type");
		
		//select 박스에 나타나는 글귀가 현재 선택된 리스트가 되게끔 해준다.
		selectedType.textContent = typeSelectBoxListLis[i].textContent;
		
		clearTodoContentList();
		
		load();
		
		//select 했을 때, 메뉴가 닫힘
		typeSelectBoxList.classList.toggle("visible");
		
	}
	
}

todoAddButton.onclick = () => {
	modalContainer.classList.toggle("modal-visible");

	//overflow hidden 하지 않으면 모달이 떠도 스크롤이 내려간다.
	todoContentList.style.overflow = "hidden";
	setModalEvent();
}

function clearModalTodoInputValue(modalTodoInput) {
	modalTodoInput.value = "";
}

function uncheckedImportance(importanceFlag) {
	importanceFlag.checked = false;
}

function setModalEvent() {
	const modalCloseButton = modalContainer.querySelector(".modal-closed-button");
	const importanceFlag = modalContainer.querySelector(".importance-check");
	const modalTodoInput = modalContainer.querySelector(".modal-todo-input");
	const modalCommitButton = modalContainer.querySelector(".modal-commit-button");
	
	modalContainer.onclick = (e) => {
		//타겟 객체가 자기자신이어야만 하게끔 if를 해줌
		if(e.target == modalContainer){
			//close버튼과 동일한 행위를 함
			modalCloseButton.click();
		}
	}

	modalCloseButton.onclick = () => {
		modalContainer.classList.toggle("modal-visible");
		todoContentList.style.overflow = "auto";
		uncheckedImportance(importanceFlag);
		clearModalTodoInputValue(modalTodoInput)
	}
	
	modalTodoInput.onkeyup = () => {
		if(window.event.keyCode == 13) {
			modalCommitButton.click();
		}
	}
	
	modalCommitButton.onclick = () => {
		data = {
			importance: importanceFlag.checked,
			todo: modalTodoInput.value
		}
		addTodo(data);
		modalCloseButton.click();
	}
	
}

////////////////////////////////////////////////////////////<<<<REQU>>>>////////////////////////////////////////////////////////////



//response.data = service 의 List<TodoListRespDto> 
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
			const todoList= response.data;
			
			//첫번째 data에서 totalCount를 가져와서 계산식에 전달
			setTotalPage(todoList[0].totalCount);
			setIncompleteCount(todoList[0].incompleteCount);
			createList(todoList);
		},
		error: errorMessage
		
	})
}

function updateTodoContent(todoCode, todo) {
	let successFlag = false;
	$.ajax({
		type: "put",
		url: `/api/v1/todolist/todo/${todoCode}`,
		contentType: "application/json", 
		data: JSON.stringify({
			"todoCode": todoCode,
			"todo": todo
			}),
		async: false,
		dataType: "json",
		success: (response) => {
			successFlag =  response.data
			},
		error: errorMessage
	})
	return successFlag;
}

//type(complete, incomplete, importance)에 따라 수정요청 함수 
//async 는 동기화 처리라는 뜻이다. 동기화를 해줘야 보류하지 않고, 바로바로 수정한다.
//async false -> 동기 처리
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



//삭제 요청 함수
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

function addTodo(data) {
	$.ajax({
		type: "post",
		url: `/api/v1/todolist/todo`,
		contentType: "application/json",
		data: JSON.stringify(data),
		async: false,
		dataType: "json",
		success: (response) => {
			if(response.data) {
				clearTodoContentList();
				load();
			}
		},
		error: errorMessage
	})
}

//에러메세지
function errorMessage(request, status, error) {
	alert("요청 실패");
	console.log(request.status);
	console.log(request.responseText);
	console.log(error);
}

