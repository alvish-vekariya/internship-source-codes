function addEduRow(e){
    e.preventDefault();
    let newtr = document.createElement('tr');

    let stmt = `
    <td> <input type="text" class="form-control" id="degree"><p class='text-danger' id="degreeP"></p></td>
    <td> <input type="text" class="form-control" id="school"><p class='text-danger' id="schoolP"></p></td>
    <td> <input type="month" class="form-control" id="startdate"><p class='text-danger' id="startP"></p></td>
    <td> <input type="month" class="form-control" id="passout"><p class='text-danger' id="passoutP"></p></td>
    <td> <input type="number" class="form-control" id="percentage" min="0" max="100" step=".01"><p class='text-danger' id="percentageP"></p></td>
    <td> <input type="number" class="form-control" id="backlog" placeholder="If any" min="0"><p class='text-danger' id="backlogP"></p></td>
    <td><button class="btn btn-remove btn-danger text-white" onclick="removeEduRow(this)" type='button'><span>&minus;</span></button></td>
    `;
    newtr.innerHTML += stmt;

    document.getElementById('eduTable').appendChild(newtr);
}

function removeEduRow(r){
    let i = r.parentNode.parentNode.rowIndex - 1;
    document.getElementById('eduTable').deleteRow(i);
}

const url = 'https://65e93e934bb72f0a9c50fc04.mockapi.io/student/details/students';

async function addData(e){
    let inputs = document.querySelectorAll('.form-control')
    for(let i=0;i<inputs.length;i++){
        inputs[i].setAttribute('oninput','isvalid()')
    }
    if(isvalid()){
        e.preventDefault();

        var edu = [];
        let tbl = document.querySelectorAll('#eduTable tr').length;
        let tb = document.querySelectorAll('#eduTable tr');
        

        for(let i=0;i<tbl;i++){
            let st = {
                Degree : tb[i].querySelector('#degree').value,
                school : tb[i].querySelector('#school').value,
                start : tb[i].querySelector('#startdate').value,
                passout : tb[i].querySelector('#passout').value,
                percentage : tb[i].querySelector('#percentage').value,
                backlog : tb[i].querySelector('#backlog').value
            }
            edu.push(st);
        }

        let record = {
            Firstname : document.getElementById('firstname').value.trim(),
            Lastname : document.getElementById('lastname').value.trim(),
            DateOfBirth : document.getElementById('dob').value,
            Email : document.getElementById('email').value.trim(),
            Address : document.getElementById('address').value,
            GraduationYear : document.getElementById('graduationyear').value,
            education: edu,
            password: document.getElementById('pswd').value
        }

        console.log(record);
        let a = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        });

        if(a.ok){
            document.getElementById('myForm').reset();
            alert(`${record.Firstname} is inserted successfully.`);
            location.href = '../../index.html';
        }

        for(let i=0;i<inputs.length;i++){
            inputs[i].removeAttribute('oninput')
        }
    }else{
        e.preventDefault();
    }
}

function showPswd(){
    if(document.getElementById('pswd').type == 'password'){
        document.getElementById('pswd').type = 'text';
    }else{
        document.getElementById('pswd').type = 'password';
    }
}

function isvalid(){
    let firstname = document.getElementById('firstname').value.trim();
    let lastname = document.getElementById('lastname').value.trim();
    let dateofbirth = document.getElementById('dob').value;
    let email = document.getElementById('email').value.trim();
    let address = document.getElementById('address').value;
    let graduationyear = document.getElementById('graduationyear').value;
    let password = document.getElementById('pswd').value;

    let fname = document.querySelector("#firstnamep");
    let fnameip = document.querySelector("#firstname");
    let dob = document.querySelector("#dobp");
    let dobip = document.querySelector("#dob");
    let em = document.querySelector("#emailp");
    let emailip = document.querySelector("#email");
    let ad = document.querySelector("#addressp");
    let addip = document.querySelector("#address");
    let gy = document.querySelector("#graduationyearp");
    let graduationip = document.querySelector("#graduationyear");
    let passwordip = document.getElementById('pswd');
    let pswdp = document.getElementById('passwordp');


    let a = validFirstName(firstname,fname,fnameip);
    let b = validBirth(dateofbirth,dob,dobip);
    let c = validGraduation(dateofbirth, graduationyear, gy, graduationip);
    let d = validEmail(email,em, emailip);
    let e = validAddress(address,ad,addip);
    let f = validEducation();
    let p = validPassword(password, passwordip, pswdp);

    if( a && b && c && d && e && f && p){
        return true;
    }else{
        return false;
    }
}

function validPassword(password, passwordip, pswdp){
    if(password == ""){
        pswdp.innerHTML = '**required';
        passwordip.style.border = '1px solid red';
    }else{
        pswdp.innerHTML = "";
        passwordip.style.border = '';
        return true;
    }
}

function validEducation(){
    let rows = document.getElementById('eduTable').querySelectorAll('tr');
    let arr = [];
    for(let x=0;x<rows.length;x++){
        arr[x] = rowCheck(rows[x]);
    }

    let ctr=0;
    for(let z=0;z<arr.length;z++){
        if(arr[z] == true){
            ctr++;
        }
    }

    if(ctr == arr.length){
        return true;
    }else{
        return false;
    }
}

function rowCheck(row){
    console.log(row);
    let degree = row.querySelector('#degree').value;
    let school = row.querySelector('#school').value;
    let start = row.querySelector('#startdate').value;
    let passout = row.querySelector('#passout').value;
    let percentage = row.querySelector('#percentage').value;
    let backlog = row.querySelector('#backlog').value;
    let dateofbirth = document.getElementById('dob').value;

    let degreeCheck = false;
    let schoolCheck = false;
    let startCheck = false;
    let passoutCheck = false;
    let percentageCheck = false;
    let backlogCheck = false;

    if(degree == ""){
        row.querySelector('#degree').style.border = '1px solid red';
        row.querySelector('#degreeP').innerHTML = '**required';
    }else{
        row.querySelector('#degree').style.border = '';
        row.querySelector('#degreeP').innerHTML = '';
        degreeCheck = true;
    }

    if(school == ""){
        row.querySelector('#school').style.border = '1px solid red';
        row.querySelector('#schoolP').innerHTML = '**required';
    }else{
        row.querySelector('#school').style.border = '';
        row.querySelector('#schoolP').innerHTML = '';
        schoolCheck = true;
    }

    let startDate = new Date(start);
    let dob = new Date(dateofbirth);
    if(start == ""){
        row.querySelector('#startdate').style.border = '1px solid red';
        row.querySelector('#startP').innerHTML = '**required';
    }else if(startDate.getFullYear() <= dob.getFullYear()){
        row.querySelector('#startdate').style.border = '1px solid red';
        row.querySelector('#startP').innerHTML = '**not before D.O.B.';
    }else{
        row.querySelector('#startdate').style.border = '';
        row.querySelector('#startP').innerHTML = '';
        startCheck = true;
    }

    let passoutDate = new Date(passout);
    if(passout == ""){
        row.querySelector('#passout').style.border = '1px solid red';
        row.querySelector('#passoutP').innerHTML = '**required';
    }else if(passoutDate.getFullYear() <= startDate.getFullYear()){
        row.querySelector('#passout').style.border = '1px solid red';
        row.querySelector('#passoutP').innerHTML = '**not before startdate';
    }else{
        row.querySelector('#passout').style.border = '';
        row.querySelector('#passoutP').innerHTML = '';
        passoutCheck = true;
    }
    
    if(percentage == ""){
        row.querySelector('#percentage').style.border = '1px solid red';
        row.querySelector('#percentageP').innerHTML = '**required';
    }else{
        row.querySelector('#percentage').style.border = '';
        row.querySelector('#percentageP').innerHTML = '';
        percentageCheck = true;
    }

    if(backlog == ""){
        row.querySelector('#backlog').style.border = '1px solid red';
        row.querySelector('#backlogP').innerHTML = '**required';
    }else{
        row.querySelector('#backlog').style.border = '';
        row.querySelector('#backlogP').innerHTML = '';
        backlogCheck = true;
    }

    if(degreeCheck && schoolCheck && startCheck && passoutCheck && percentageCheck && backlogCheck){
        return true;
    }else{
        return false;
    }
}

fetch_students();
let students;

async function fetch_students(){
    let a = await fetch(url);
    students = await a.json();
}

function validEmail(email,em, emailip){
    if(email == ""){
        em.innerHTML = '**required';
        emailip.style.border = '1px solid red';
    }else{
        var mailformat = /[a-z0-9\.]+@[a-z]{2,}\.[a-z]{2,}$/;
        if(email.match(mailformat))
        {
            let bl = false;
            for(let i of students){
                if(email == i.Email){
                    em.innerHTML = "**Email Already Exists";
                    break;
                }else{
                    em.innerHTML = "";
                    emailip.style.border = '';
                    bl = true;
                }
            }
            return bl;
        }else{
            em.innerHTML = "**enter valid email";
            emailip.style.border = '1px solid red';
        }
    }

}

function validAddress(address,ad, addip){
    if(address == ""){
        ad.innerHTML = '**required';
        addip.style.border = '1px solid red';
    }else{
        ad.innerHTML = "";
        addip.style.border = '';
        return true;
    }
}

function validGraduation(dob, graduationyear, gy, graduationip){

    if(graduationyear == ""){
        gy.innerHTML = '**required';
        graduationip.style.border = '1px solid red';
    }else{
        let age = ()=>{
            let some = new Date(dob);
            let today = new Date();
            return today.getFullYear() - some.getFullYear();
        }
        dob = new Date(dob);
        let gdate = new Date(graduationyear);
        if(gdate.getFullYear() <= dob.getFullYear()){
            gy.innerHTML = '**enter valid date';
            graduationip.style.border = '1px solid red';
        }else if(age < 18){
            gy.innerHTML = '**enter valid date';
            graduationip.style.border = '1px solid red';
        }else{
            gy.innerHTML ="";
            graduationip.style.border = '';
            return true;
        }
    }
}

function validBirth(date,dp, dobip){
    if(date == ""){
        dp.innerHTML = '**required';
        dobip.style.border = '1px solid red';
    }else{
        let some = new Date(date);
        let today = new Date();
        let years = today.getFullYear() - some.getFullYear();

        if(years < 18){
            dobip.style.border = '1px solid red';
            dp.innerHTML = "**age must 18 or above";
        }else{
            dp.innerHTML = "";
            dobip.style.border = '';
            return true;
        }
    }
}

function validFirstName(firstname,fname, fnameip){
    let ctrno = 0;
    if(firstname == ""){
        fname.innerHTML = '**required';
        fnameip.style.border = '1px solid red';
    }else{
        for(let i of firstname){
            if(i>='0' && i<='9'){
                // console.log("its number");
                // fname.innerHTML = 'Should not contain numbers.'
                ctrno++;
                break;
            }else if(i>='a' && i<='z' || i>='A' && i<='Z'){
                // console.log('its Character');
            }else{
                // console.log('its special character');
                // fname.innerHTML('Should not contain Special Characters.')
                ctrno++;
                break;
            }
        }
        if(ctrno == 0){
            fname.innerHTML = '';
            fnameip.style.border = '';
            return true;
        }else{
            fname.innerHTML = '**should only contains characters';
            fnameip.style.border = '1px solid red';
        }
    }
}
