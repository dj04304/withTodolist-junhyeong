const selectedTypeButton = document.querySelector(".selected-type-button");
const typeSelectBoxList = document.querySelector(".type-select-box-list"); 
const typeSelectBoxListLis = typeSelectBoxList.querySelectorAll("li"); // typeSelectBoxList의 li 를 가져옴
const todoContentList = document.querySelector(".todo-content-list");
const sectionBody = document.querySelector(".section-body");//list의 높이

// 가져올 페이지
let page = 1;

//
let totalPage = 0;

sectionBody.onscroll = () => {
	//console.log("sectionBody: " + sectionBody.offsetHeight);
	//console.log("scrollTop: " + sectionBody.scrollTop);
	//console.log("todoContentList: " + todoContentList.offsetHeight); //전체길이
	
	//스크롤의 길이
	let checkNum = todoContentList.offsetHeight - sectionBody.offsetHeight - sectionBody.scrollTop;
	
	//오차범위는 보통  1과 -1 사이이기때문에 잡아줘야 한다.
	if(checkNum < 1 && checkNum > -1 && page < totalPage) {
		console.log(page);
		console.log(totalPage);
		page++;
		load();
	}
	
}



// listType = all, complete, incomplete, importance
let listType = "all";

load();

selectedTypeButton.onclick = () => {
    typeSelectBoxList.classList.toggle("visible");
}

//focus가 벗어났을 때 
/*
selectedTypeButton.onblur = () => {
    typeSelectBoxList.classList.toggle("visible");
}
*/

for(let i = 0; i < typeSelectBoxListLis.length; i++) {
	
	// typeSelectBoxList의 list들을 클릭했을 때 기능
	typeSelectBoxListLis[i].onclick = () => {
		//페이지를 1로 초기화
		page = 1;
		
		for(let i = 0; i < typeSelectBoxListLis.length; i++) {
			//typeSelectBoxListLis 가 type-selected 를 먼저 초기화 시켜준다.
				typeSelectBoxListLis[i].classList.remove("type-selected");	
			
		}
		
		const selectedType = document.querySelector(".selected-type");
		
		//선택된 list를 type-selected에 포함해준다.
		typeSelectBoxListLis[i].classList.add("type-selected");
		
		//listType 부분을 소문자로 바꿔서 listType에 대입해줌 (앞글자가 대문자이기 때문에)
		listType = typeSelectBoxListLis[i].textContent.toLowerCase();
		
		
		selectedType.textContent = typeSelectBoxListLis[i].textContent;
		
		//todoContentList내용을 초기화 해주고 load()
		todoContentList.innerHTML = "";
		
		load();
		
		//onblur역할을 해줌
		 typeSelectBoxList.classList.toggle("visible");
	}
}

//ajax
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
				//console.log(JSON.stringify(response));
				getList(response.data);
			},
			error: errorMessage
	})
}

//마지막 리스트
function setTotalCount(totalCount){
	//Math.floor 로 버림을 하고 +1을 해준다.
	totalPage = totalCount % 20 == 0 ? totalCount / 20 : Math.floor(totalCount / 20) + 1
}

function getList(data) {
	const incompleteCountNumber = document.querySelector(".incomplete-count-number");
	//완료하지 않은 일 가져오기
	incompleteCountNumber.textContent = data[0].incompleteCount;
	
	setTotalCount(data[0].totalCount);
	
	console.log(todoContentList);
	for(let content of data) {
		const listContent = `
				<li class="todo-content">
                    <input type="checkbox"  id="complete-check-${content.todoCode}" class="complete-check" ${content.todoComplete ? 'checked' : ''}>
                    <label for="complete-check-${content.todoCode}"></label>
                    <div class="todo-content-text">${content.todo}</div>
                    <input type="text" class="todo-content-input visible" value = "${content.todo}">
                    <input type="checkbox" id="importance-check-${content.todoCode}" class="importance-check" ${content.importance ? 'checked' : ''}>
                    <label for="importance-check-${content.todoCode}"></label>
                    <div class="trash-button"><i class="fa-solid fa-trash"></i></div>
                </li>
		`
		todoContentList.innerHTML += listContent;
	}
}

function errorMessage(request, status, error) {
	alert("요청 실패");
	console.log(request.status);
	console.log(request.responseText);
	console.log(error);
}
