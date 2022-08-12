const inputs = document.querySelectorAll("input");
const signupButton = document.querySelectorAll("button");

let checkUsernameFlag = false;

//console.log(inputs[0]);
//console.log(signupButton);

//로그인 페이지로 이동
signupButton[1].onclick = () => {
	location.href = "/todolist/signin";
}


inputs[0].onblur = () => {
	/*
		아이디 중복 확인
	*/	
	
	$.ajax({
		async: false,
		type: "get",
		url: "/api/v1/auth/signup/validation/username",
		data: {username: inputs[0].value},
		dataType:"json",
		success: (response) => {
				checkUsernameFlag = response.data;
			
				if(response.data) {
					alert("사용 가능한 아이디입니다.");
				}else {
					alert("이미 사용중인 아이디입니다.");
				}
		},
		error: errorMsg
	})
}

signupButton[0].onclick = () => {
	let signupData = {
		username: inputs[0].value,
		password: inputs[1].value,
		name: inputs[2].value,
		email: inputs[3].value,
		"usernameCheckFlag":  checkUsernameFlag
	}
	
	/*
		회원가입 버튼
	 */
	 
	 $.ajax({
			async: false,
			type: "post",
			url: "/api/v1/auth/signup",
			contentType: "application/json",
			data: JSON.stringify(signupData),
			dataType: "json",
			success: (response) => {
				if(response.data) {
						alert("회원가입 완료");
						location.replace("/todolist/signin");
				}
			},
			error: errorMsg
			
	})
}

function errorMsg(error) {
	if(error.status == 400) {
		alert(JSON.stringify(error.responseJSON.data));
	}else {
		console.log("요청실패");
		console.log(error)
	}
}