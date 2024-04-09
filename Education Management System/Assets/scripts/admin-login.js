const url = 'https://65e93e934bb72f0a9c50fc04.mockapi.io/student/details/admin/1';
let admin;

getAdmin();
async function getAdmin(){
    let adminData = await fetch(url);
    admin = await adminData.json();
    console.log(admin);
}

function checkLogin(){
    let uname = document.getElementById('username').value;
    let pswd = document.getElementById('password').value;

    if(uname == admin.username && pswd == admin.password){
        sessionStorage.setItem('admin','admin');
        location.href = 'admin-index.html';
    }else{
        document.querySelector('#warning').classList.remove('d-none');
    }
}

function showPassword(){
    if(document.querySelector('#password').type == 'password'){
        document.querySelector('#password').type = 'text';
    }else{
        document.querySelector('#password').type = 'password';
    }
}