if(!sessionStorage.getItem('admin')){
    location.href = 'admin-login.html';
}else{
    $(document).ready(async ()=>{
        const url = "https://65e93e934bb72f0a9c50fc04.mockapi.io/student/details/students";
    
        let a = await fetch(url);
        let student = await a.json();
        console.log(student);
        let studentEmail;
    
        showData();
    
        function showData(){
            let tb = $('#showTable').DataTable(); // Use DataTable() to get the DataTable instance
        
            tb.clear();
        
            for (let i = 0; i < student.length; i++) {
                let dob = new Date(student[i].DateOfBirth);
                let curr = new Date();
                let age = curr.getFullYear() - dob.getFullYear();
                let stmt = [
                    student[i].Firstname,
                    student[i].Lastname,
                    student[i].DateOfBirth,
                    student[i].Email,
                    student[i].Address,
                    student[i].GraduationYear,
                    age,
                    `<button class="btn edit btn-outline-success rounded-circle" data-bs-toggle="modal" data-bs-target="#exampleModal" data-index=${student[i].studentID} ><i class="fa-solid fa-user-pen"></i></button>&nbsp;
                    <button class="btn delete btn-outline-danger rounded-circle" data-index=${student[i].studentID} ><i class="fa-solid fa-trash-can" ></i></button>`,
                    `<button class="btn info rounded-circle" data-index=${i}><i class="fa-solid fa-info"></i></button>`
                ];
                tb.row.add(stmt);
            }
            tb.draw();
        }

        $(document).on('click','#signout',()=>{
            sessionStorage.clear();
            location.href = 'admin-login.html'
        })

        $(document).on('click','#home',()=>{
            sessionStorage.clear();
            location.href = '../../index.html'
        })
    
    
        $('#myForm').submit(async (e)=>{
            $('.form-control').on('input',()=>{
                isvalid();
            });
            if(isvalid()){
                e.preventDefault();
                var edu = [];
                let tbl = $('#eduTable tr').length;
                // let studID = student[student.length-1].studentID + 1;
                // console.log(studID);
    
                console.log(tbl);
        
                for(let i=0;i<tbl;i++){
                    let tb = $('#eduTable tr').eq(i);
                    let st = {
                        Degree : tb.find('#degree').val(),
                        school : tb.find('#school').val(),
                        start : tb.find('#startdate').val(),
                        passout : tb.find('#passout').val(),
                        percentage : tb.find('#percentage').val(),
                        backlog : tb.find('#backlog').val()
                    }
                    edu.push(st);
                }
        
                let record = {
                    // studentID : studID,
                    Firstname : $('#firstname').val().trim(),
                    Lastname : $('#lastname').val().trim(),
                    DateOfBirth : $('#dob').val(),
                    Email : $('#email').val().trim(),
                    Address : $('#address').val(),
                    GraduationYear : $('#graduationyear').val(),
                    education: edu,
                    password : $('#pswd').val()
                }
    
                console.log(record);    
                
                let a = await fetch(url,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(record)
                });
                $('input').removeAttr('oninput');
                if(a.ok){
                    location.reload();
                    // showData();
                }
        
            }else{
                e.preventDefault();
            }
        });
    
        $(document).on('click', '.remove', function() {
            let index = $(this).closest('tr');
            $('#eduTable').find(index).remove();
            // removeEduRow(index);
        });
    
        $(document).on('click','.addbtn',()=>{
            addEduRow();
        });
    
        function addEduRow(){
            // e.preventDefault();
        
            let stmt = `
            <td> <input type="text" class="form-control" id="degree"><p id="degreeP"></p></td>
            <td> <input type="text" class="form-control" id="school"><p id="schoolP"></p></td>
            <td> <input type="month" class="form-control" id="startdate"><p id="startP"></p></td>
            <td> <input type="month" class="form-control" id="passout"><p id="passoutP"></p></td>
            <td> <input type="number" class="form-control" id="percentage" min="0" max="100" step=".01"><p id="percentageP"></p></td>
            <td> <input type="number" class="form-control" id="backlog" placeholder="If any" min="0"><p id="backlogP"></p></td>
            <td><button class="btn btn-remove remove type="button" onclick="removeEduRow(this)"><span>&minus;</span></button></td>
            `;
            let newtr = $('<tr></tr>').html(stmt);
        
            $('#eduTable').append(newtr);
        }
    
        $(document).on('click', '.remove', function() {
            let index = $(this).closest('tr');
            $('#eduTable').find(index).remove();
            // removeEduRow(index);
        });
    
        $(document).on('click','.info',function(){
            // $("[data-dt-row]").hide();
            let tr = $(this).closest('tr');
            let index = $(this).data('index');
            console.log(index);
            
            let tb = $('#showTable').DataTable();
            let myRow = tb.row(tr);
    
            if (myRow.child.isShown()) {
                tr.find('.info').css({'color':'#96C6D9','background-color':''});
                tr.css({'background-color': '#023859', 'color': 'white', 'font-weight':'','font-size':''});
                myRow.child.hide();
            }else{
                console.log(myRow);
                tr.find('.info').css({'color':'rgb(151 213 237)','background-color':'#023859'});
                tr.css({'background-color': 'rgb(151 213 237)', 'color': '#023859','font-weight':'500', 'font-size':'1.1rem'});
                myRow.child(showEducation(index)).show();
                infoShow(index);
            }
        });
    
        function showEducation(index){
            let st = `<div id="eduDiv">
            <h3 style="color: #023859">${student[index].Firstname}'s Education</h3>
            <table class="table eduShowInfo" id="eduShow${index}">
            <thead>
                <tr>
                    <th scope="col">Degree/Board</th>
                    <th scope="col">School/College</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">Passout Year</th>
                    <th scope="col">Percentage</th>
                    <th scope="col">Backlog</th>
                </tr>
            </thead>
            <tbody>
    
            </tbody>
            </table></div>`;
            return st;
        }
    
        function infoShow(index){
    
            $('.edu-row').css('display','flex');
            let edTb = $(`#eduShow${index}`).DataTable({
                paging: false,
                info: false
            });
            edTb.clear();
            for(let i=0;i<student[index].education.length;i++){
                let stmt = [
                    student[index].education[i].Degree,
                    student[index].education[i].school,
                    student[index].education[i].start,
                    student[index].education[i].passout,
                    student[index].education[i].percentage,
                    student[index].education[i].backlog
                ];
                edTb.row.add(stmt);
            }
            edTb.draw();
        }
    
    
        $(document).on('click', '.delete', function() {
            // Retrieve the index from the data attribute
    
            let mr = $(this).closest('tr');
            // console.log([...mr.children()][0]);
            // let temp = [...mr.children()]
            // console.log(temp[0])
            let index = $(this).data('index');
            console.log(index);
            let name;
            // student.forEach((ele,ind) => {
            //     if(ele.studentID == index){
            //         name = ele.Firstname;
            //     }
            // });
    
            for(let ele of student){
                if(ele.studentID == index){
                    name = ele.Firstname;
                }
            }
            console.log(name)
            
            // Call the removeData function with the retrieved index
            removeData(index, mr,name);
        });
    
        async function removeData(x, mr,name){
            if(confirm(`are sure to delete ${name}?`)){
                let a = await fetch(`${url}/${x}`,{
                    method: "DELETE",
                    headers:{}
                })
                let tb = $('#showTable').DataTable();
                tb.row(mr).remove();
                tb.draw();
               
            }   
        }
    
        $(document).on('click', '.edit', function() {
            // Retrieve the index from the data attribute
            let index = $(this).data('index');
            console.log(index);
            
            // Call the removeData function with the retrieved index
            editData(index);
        });
    
        function editData(x){        
            // let x = i.parentNode.parentNode.rowIndex - 1;
            let person;
            for( ele of student){
                if(ele.studentID == x){
                    person = ele;
                }
            }
    
            $('#exampleModalLabel').html(`Editing ${person.Firstname}'s Data`);
            $("#submit").val("Update").attr('class','update btn border sub-button px-5 fs-5').attr('type','button');
            $('#firstname').val(person.Firstname);
            $('#lastname').val(person.Lastname);
            $('#dob').val(person.DateOfBirth);
            $('#email').val(person.Email);
            $('#address').val(person.Address);
            $('#graduationyear').val(person.GraduationYear);
            $('#pswd').val(person.password);

            studentEmail = person.Email;
        
            $('#eduTable').html('');
            let ctr = 0;
            for(let i of person.education){
                if(ctr<2){
                    stmt = `
                    <td> <input type="text" class="form-control" id="degree" value="${i.Degree}"><p id="degreeP"></p></td>
                    <td> <input type="text" class="form-control" id="school" value="${i.school}"><p id="schoolP"></p></td>
                    <td> <input type="month" class="form-control" id="startdate" value="${i.start}"><p id="startP"></p></td>
                    <td> <input type="month" class="form-control" id="passout" value="${i.passout}"><p id="passoutP"></p></td>
                    <td> <input type="number" class="form-control" id="percentage" placeholder="Don't use %sign" min="0" max="100" step=".01" value="${i.percentage}"><p id="percentageP"></p></td>
                    <td> <input type="number" class="form-control" id="backlog" placeholder="If any" min="0" value="${i.backlog}"><p id="backlogP"></p></td>
                    <td><button class="btn btn-remove remove" disabled></button></td>
                    `;
                    let newtr = $('<tr></tr>').html(stmt);
                    $('#eduTable').append(newtr);
                    ctr++;
                }else{
                    stmt = `
                    <td> <input type="text" class="form-control" id="degree" value="${i.Degree}"><p id="degreeP"></p></td>
                    <td> <input type="text" class="form-control" id="school" value="${i.school}"><p id="schoolP"></p></td>
                    <td> <input type="month" class="form-control" id="startdate" value="${i.start}"><p id="startP"></p></td>
                    <td> <input type="month" class="form-control" id="passout" value="${i.passout}"><p id="passoutP"></p></td>
                    <td> <input type="number" class="form-control" id="percentage" placeholder="Don't use %sign" min="0" max="100" step=".01" value="${i.percentage}"><p id="percentageP"></p></td>
                    <td> <input type="number" class="form-control" id="backlog" placeholder="If any" min="0" value="${i.backlog}"><p id="backlogP"></p></td>
                    <td><button class="btn btn-remove remove" type="button"><span>&minus;</span></button></td>
                    `;
                    let newtr = $('<tr></tr>').html(stmt);
                    $('#eduTable').append(newtr);
                }
            }
            $(".update").on('click',function(){ return updateData(x);});
        }
        
        async function updateData(x) {
            if (isvalid()){
                
                // student.splice(x, 1);
                // var record = [];
                // e.preventDefault();
                var edu = [];
                let tbl = $('#eduTable tr').length;
                let tb = $('#eduTable tr');
        
                for (let i = 0; i < tbl; i++) {
                    let st = {
                        Degree: $(tb[i]).find('#degree').val(),
                        school: $(tb[i]).find('#school').val(),
                        start: $(tb[i]).find('#startdate').val(),
                        passout: $(tb[i]).find('#passout').val(),
                        percentage: $(tb[i]).find('#percentage').val(),
                        backlog: $(tb[i]).find('#backlog').val()
                    }
                    edu.push(st);
                }
        
                let record = {
                    // studentID : x,
                    Firstname: $('#firstname').val().trim(),
                    Lastname: $('#lastname').val().trim(),
                    DateOfBirth: $('#dob').val(),
                    Email: $('#email').val().trim(),
                    Address: $('#address').val(),
                    GraduationYear: $('#graduationyear').val(),
                    education: edu,
                    password: $('#pswd').val()
                }
    
                let a = await fetch(`${url}/${x}`,{
                    method: "PUT",
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(record)
                })
    
                if(a.ok){
                    location.reload();
                }
    
    
            }else{
                return false;
            }
        }
    
    
        function isvalid(){
            let firstname = $('#firstname').val().trim();
            let lastname = $('#lastname').val().trim();
            let dateofbirth = $('#dob').val();
            let email = $('#email').val().trim();
            let address = $('#address').val();
            let graduationyear = $('#graduationyear').val();
            let password = $('#pswd').val();
        
            let fname = $("#firstnamep");
            let fnameip = $("#firstname");
            let dob = $("#dobp");
            let dobip = $("#dob");
            let em = $("#emailp");
            let emailip = $("#email");
            let ad = $("#addressp");
            let addip = $("#address");
            let gy = $("#graduationyearp");
            let graduationip = $("#graduationyear");
            let passwordip = $('#pswd');
            let pswdp = $('#passwordp');
        
        
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
                pswdp.html('**required');
                passwordip.css('border','1px solid red');
            }else{
                pswdp.html("");
                passwordip.css('border','');
                return true;
            }
        }
        
    
        function validEducation(){
            let rows = $('#eduTable').find('tr');
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
            let degree = $(row).find('#degree').val();
            let school = $(row).find('#school').val();
            let start = $(row).find('#startdate').val();
            let passout = $(row).find('#passout').val();
            let percentage = $(row).find('#percentage').val();
            let backlog = $(row).find('#backlog').val();
            let dateofbirth = $(row).find('#dob').val();
        
            let degreeCheck = false;
            let schoolCheck = false;
            let startCheck = false;
            let passoutCheck = false;
            let percentageCheck = false;
            let backlogCheck = false;
        
            if(degree == ""){
                $(row).find('#degree').css('border','1px solid red');
                $(row).find('#degreeP').html('**required');
            }else{
                $(row).find('#degree').css('border','');
                $(row).find('#degreeP').html('');
                degreeCheck = true;
            }
        
            if(school == ""){
                $(row).find('#school').css('border','1px solid red');
                $(row).find('#schoolP').html('**required');
            }else{
                $(row).find('#school').css('border','');
                $(row).find('#schoolP').html('');
                schoolCheck = true;
            }
        
            let startDate = new Date(start);
            let dob = new Date(dateofbirth);
            if(start == ""){
                $(row).find('#startdate').css('border','1px solid red');
                $(row).find('#startP').html('**required');
            }else if(startDate.getFullYear() <= dob.getFullYear()){
                $(row).find('#startdate').css('border','1px solid red');
                $(row).find('#startP').html('**not before D.O.B.');
            }else{
                $(row).find('#startdate').css('border','');
                $(row).find('#startP').html('');
                startCheck = true;
            }
        
            let passoutDate = new Date(passout);
            if(passout == ""){
                $(row).find('#passout').css('border','1px solid red');
                $(row).find('#passoutP').html('**required');
            }else if(passoutDate.getFullYear() <= startDate.getFullYear()){
                $(row).find('#passout').css('border','1px solid red');
                $(row).find('#passoutP').html('**not before startdate');
            }else{
                $(row).find('#passout').css('border','');
                $(row).find('#passoutP').html('');
                passoutCheck = true;
            }
            
            if(percentage == ""){
                $(row).find('#percentage').css('border','1px solid red');
                $(row).find('#percentageP').html('**required');
            }else{
                $(row).find('#percentage').css('border', '');
                $(row).find('#percentageP').html('');
                percentageCheck = true;
            }
        
            if(backlog == ""){
                $(row).find('#backlog').css('border','1px solid red');
                $(row).find('#backlogP').innerHTML = '**required';
            }else{
                $(row).find('#backlog').css('border','');
                $(row).find('#backlogP').html('');
                backlogCheck = true;
            }
        
            if(degreeCheck && schoolCheck && startCheck && passoutCheck && percentageCheck && backlogCheck){
                return true;
            }else{
                return false;
            }
        }
    
        function validEmail(email,em, emailip){
            if(email == ""){
                em.html('**required');
                emailip.css('border','1px solid red');
            }else{
                var mailformat = /[a-z0-9\.]+@[a-z]{2,}\.[a-z]{2,}$/;
                if(email.match(mailformat))
                {
                    let bl = false;
                    for(let i of student){
                        if(email == i.Email){
                            if(i.Email == studentEmail){
                                em.html("");
                                emailip.css('border','');
                                bl = true;
                            }else{
                                em.html("**Email Already Exists");
                                break;
                            }
                        }else{
                            em.html("");
                            emailip.css('border','');
                            bl = true;
                        }
                    }
                    return bl;
                }else{
                    em.html("**enter valid email");
                    emailip.css('border','1px solid red');
                }
            }
        }
        
        function validAddress(address,ad, addip){
            if(address == ""){
                ad.html('**required');
                addip.css('border','1px solid red');
            }else{
                ad.html("");
                addip.css('border','');
                return true;
            }
        }
        
        function validGraduation(dob, graduationyear, gy, graduationip){
        
            if(graduationyear == ""){
                gy.html('**required');
                graduationip.css('border','1px solid red');
            }else{
                let age = ()=>{
                    let some = new Date(dob);
                    let today = new Date();
                    return today.getFullYear() - some.getFullYear();
                }
                dob = new Date(dob);
                let gdate = new Date(graduationyear);
                if(gdate.getFullYear() <= dob.getFullYear()){
                    gy.html('**enter valid date');
                    graduationip.css('border','1px solid red');
                }else if(age < 18){
                    gy.html('**enter valid date');
                    graduationip.css('border','1px solid red');
                }else{
                    gy.html('');
                    graduationip.css('border','');
                    return true;
                }
            }
        }
        
        function validBirth(date,dp, dobip){
            if(date == ""){
                dp.html('**required');
                dobip.css('border','1px solid red');
            }else{
                let some = new Date(date);
                let today = new Date();
                let years = today.getFullYear() - some.getFullYear();
        
                if(years < 18){
                    dobip.css('border','1px solid red');
                    dp.html("**age must 18 or above");
                }else{
                    dp.html('');
                    dobip.css('border','');
                    return true;
                }
            }
        }
        
        function validFirstName(firstname,fname, fnameip){
            let ctrno = 0;
            if(firstname == ""){
                fname.html('**required');
                fnameip.css('border','1px solid red');
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
                    fname.html('');
                    fnameip.css('border','');
                    return true;
                }else{
                    fname.html('**should only contains characters');
                    fnameip.css('border','1px solid red');
                }
            }
        }
    })
}