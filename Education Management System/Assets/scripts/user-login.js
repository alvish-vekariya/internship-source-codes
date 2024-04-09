const url = 'https://65e93e934bb72f0a9c50fc04.mockapi.io/student/details/students';

let studentID;
let students;
let studentIndex;

async function getStudents(){
    let a = await fetch(url);
    students = await a.json();
    // console.log(students);
}

async function checkStudent(){

    await getStudents();

    let email = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    for(let i of students){
        if(email == i.Email && password == i.password){
            studentID = i.studentID;
            studentIndex = students.indexOf(i);
        }
    }

    if(studentID == '' || studentID == null || studentID == undefined){
        console.log('no match');
        document.querySelector('#warning').classList.remove('d-none');
    }else{
        console.log('mil gaya', studentID);
        let login = {studid : studentIndex};
        sessionStorage.setItem('user', JSON.stringify(login));
        location.href = `student-info.html`;
    }
}

function showPassword(){
    if(document.getElementById('password').type == 'password'){
        document.getElementById('password').type = 'text';
    }else{
        document.getElementById('password').type = 'password';
    }
}