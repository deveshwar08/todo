let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let clockType = "digital";
let digitalDiv = '<div id="time" style="font-family: \'Orbitron\', sans-serif;"></div>';
let analogueDiv = '<div id="analogue-clock"><canvas id="analogue-canvas" width="400px" height="400px"></canvas></div>';
document.getElementById("clock-area").innerHTML = digitalDiv;
let defaultTodo = [];
let isUserLogged = false;
let currentUserName = "";

class User {
    constructor(username,pwd){
        this.username = username;
        this.pwd = pwd;
        this.todo = [];
    } 
}

function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    
    if(clockType == "digital"){
        h = h < 10 ? "0"+h : h;
        m = m < 10 ? "0"+m : m;
        s = s < 10 ? "0"+s : s;
        let displayTime = h + ":" + m + ":" + s;
        document.getElementById('time').innerHTML = displayTime;
    }
    else if(clockType == "analogue")
        drawClock(h,m,s);    
    
    setTimeout(function() {
        startTime()
    }, 500);

}

function drawClockArea(){
    let canvas  = document.getElementById("analogue-canvas");
    let c = canvas.getContext("2d");
    let clockRadius = canvas.height / 2; 
    c.translate(clockRadius,clockRadius);
    clockRadius = clockRadius * 0.9;
}
function drawClock(h,m,s){
    let canvas  = document.getElementById("analogue-canvas");
    let c = canvas.getContext("2d");
    let clockRadius = canvas.height / 2;
    drawFace(c,clockRadius);
    drawNumbers(c,clockRadius);
    drawTime(c,clockRadius,h,m,s);   
}
function drawFace(c,clockRadius){

    c.beginPath();
    c.arc(0, 0, clockRadius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.fillStyle = "#333";
}

function drawNumbers(c,clockRadius){
    c.font = clockRadius * 0.15 + "px sans-sherif";
    c.textBaseline = "middle";
    c.textAlign = "center";
    for(let num = 1; num < 13; num++){
        let ang = num * Math.PI / 6;
        c.rotate(ang);
        c.translate(0, -clockRadius * 0.85);
        c.rotate(-ang);
        c.fillText(num.toString(), 0, 0);
        c.rotate(ang);
        c.translate(0, clockRadius * 0.85);
        c.rotate(-ang);
    }
}

function drawTime(c,clockRadius,h,m,s){

    let hour = h;
    let minute = m;
    let second = s;
    hour = hour % 12;
    hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
    drawHand(c, hour, clockRadius*0.5, clockRadius*0.07);
    minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(c, minute, clockRadius*0.8, clockRadius*0.07);
    second = (second*Math.PI/30);
    drawHand(c, second, clockRadius*0.9, clockRadius*0.02);
}



function drawHand(c, pos, len, wid) {
    c.beginPath();
    c.lineWidth = wid;
    c.lineCap = "round";
    c.moveTo(0,0);
    c.rotate(pos);
    c.lineTo(0, -len);
    c.stroke();
    c.rotate(-pos);
}

function toggleClockType(){
    if(clockType == "digital")
    {
        clockType = "analogue";
        document.getElementById("clock-area").innerHTML = analogueDiv;
        drawClockArea();
    }
    else if(clockType == "analogue")
    {
        clockType = "digital";
        document.getElementById("clock-area").innerHTML = digitalDiv;
    }
}

function checkTodayTodo(){
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    if(localStorage.getItem("User") != null)
    {
        let retrieved = JSON.parse(localStorage.getItem("User"));
        let temp =  [];
        let flag = 0;
        for(let i = 0;i < retrieved.length;i++)
            temp[i] = retrieved[i];
        temp.forEach(arr => {
            if(arr["username"] == currentUserName)
            {
                for(let i = 0;i < arr["todo"].length;i++)
                if(today.getUTCDate() == parseInt(arr["todo"][i][2]) && currentMonth == arr["todo"][i][1] && currentYear == arr["todo"][i][0])
                    flag++;
            }
        });
        if(flag > 0)
            return true;
        else
            return false;
    }
    else
        return false;
}

function displayTodo()
{
    document.getElementById("login-signup").innerHTML = "";
    document.getElementById("login-signup-form").innerHTML = "";
    document.getElementById("todo").innerHTML = "";
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let ul = document.createElement("ul");
    ul.setAttribute("id","todo-list");
    ul.classList.add("list-group");
    let h3 = document.createElement("h3");
    let todoHeading = document.createTextNode("To-Do");
    h3.appendChild(todoHeading);
    let ulToday = document.createElement("ul");
    ulToday.setAttribute("id","today-todo-list");
    ulToday.classList.add("list-group");
    let h3Today = document.createElement("h3");
    let todoTodayHeading = document.createTextNode("Today's To-Do");
    h3Today.appendChild(todoTodayHeading);
    if(checkTodayTodo() == true)
    {
        document.getElementById("todo").appendChild(h3Today);
        document.getElementById("todo").appendChild(ulToday);
    }
    document.getElementById("todo").appendChild(h3);
    document.getElementById("todo").appendChild(ul);
    if(localStorage.getItem("User") == null)
        localStorage.setItem("User",JSON.stringify(usersDef));
    else{
        let retrieved = JSON.parse(localStorage.getItem("User"));
        let temp = [];
        let tempTodo = [];
        for(let i = 0;i < retrieved.length;i++)
            temp[i] = retrieved[i];
        temp.forEach(arr => {
            if(arr["username"] == currentUserName)
                for(let i = 0;i < arr["todo"].length;i++)
                    tempTodo[i] = arr["todo"][i];
        });    
        tempTodo.sort(function(a,b) {
            if(a[0] != b[0])
                return a[0] - b[0];
            else if(a[1] != b[1])
                return a[1] - b[1];
            else
                return a[2] - b[2];
        });
        tempTodo.forEach(arr => {
            let li = document.createElement("LI");
            li.classList.add("text-dark");
            li.classList.add("bg-light");
            li.classList.add("list-group-item");
            li.classList.add("d-flex");
            li.classList.add("justify-content-between");
            let todoText = document.createTextNode(arr[3]);
            let p = document.createElement("p");
            let deadline = arr[2] + "/" + months[arr[1]] + "/" + arr[0];
            let span = document.createElement("span");
            span.classList.add("badge");
            span.classList.add("badge-pill");
            span.classList.add("badge-danger");
            let deadlineText = document.createTextNode(deadline);
            span.appendChild(deadlineText);
            let deleteBtn = document.createElement("button");
            let deleteText = document.createTextNode("Delete");
            deleteBtn.classList.add("btn");
            deleteBtn.classList.add("btn-danger");
            deleteBtn.classList.add("btn-sm");
            deleteBtn.setAttribute("onclick","deleteTodo(this)");
            deleteBtn.appendChild(deleteText);
            let div = document.createElement("div");
            div.appendChild(span);
            div.appendChild(deleteBtn);
            if(arr[4] === true)
            {
                let s = document.createElement("s");
                p.appendChild(s);
                s.appendChild(todoText);
            }
            else if(arr[4] === false)
            {
                p.appendChild(todoText);
                let completedBtn = document.createElement("button");
                let completedText = document.createTextNode("Complete");
                completedBtn.classList.add("btn");
                completedBtn.classList.add("btn-success");
                completedBtn.classList.add("btn-sm");
                completedBtn.setAttribute("onclick","completedTodo(this)");
                completedBtn.appendChild(completedText);
                div.appendChild(completedBtn);
            }
            li.appendChild(p);
            li.appendChild(div);
            ul.appendChild(li);
            if(today.getUTCDate() == parseInt(arr[2]) && currentMonth == arr[1] && currentYear == arr[0])
            {
                let li = document.createElement("LI");
                li.classList.add("text-dark");
                li.classList.add("bg-light");
                li.classList.add("list-group-item");
                li.classList.add("d-flex");
                li.classList.add("justify-content-between");
                let todoText = document.createTextNode(arr[3]);
                let p = document.createElement("p");
                let deleteBtn = document.createElement("button");
                let deleteText = document.createTextNode("Delete");
                deleteBtn.classList.add("btn");
                deleteBtn.classList.add("btn-danger");
                deleteBtn.classList.add("btn-sm");
                deleteBtn.setAttribute("onclick","deleteTodayTodo(this)");
                deleteBtn.appendChild(deleteText);
                let div = document.createElement("div");
                div.appendChild(deleteBtn);
                if(arr[4] === true)
                {
                    let s = document.createElement("s");
                    p.appendChild(s);
                    s.appendChild(todoText);
                }
                else if(arr[4] === false)
                {
                    p.appendChild(todoText);
                    let completedBtn = document.createElement("button");
                    let completedText = document.createTextNode("Complete");
                    completedBtn.classList.add("btn");
                    completedBtn.classList.add("btn-success");
                    completedBtn.classList.add("btn-sm");
                    completedBtn.setAttribute("onclick","completedTodayTodo(this)");
                    completedBtn.appendChild(completedText);
                    div.appendChild(completedBtn);
                }
                li.appendChild(p);
                li.appendChild(div);
                ulToday.appendChild(li);
            }
        });
    }    
}
function dateClick(element)
{
    let todoDate = element.getAttribute("value");
    let todoMonth = currentMonth;
    let todoYear = currentYear;
    let todo = window.prompt("Hey!What's on this day?");
    if(todo != "" && todo !== null)
        addTodo(todoDate,todoMonth,todoYear,todo);
}
function addTodo(date,month,year,todo)
{
    let retrieved = JSON.parse(localStorage.getItem("User"));
    let temp = [];
    for(let i = 0;i < retrieved.length;i++)
    {
        temp[i] = retrieved[i];
    } 
    temp.forEach(arr =>{
        if(arr["username"] == currentUserName)
        {
            arr["todo"].push([year,month,date,todo,false]);
        }
    });
    localStorage.removeItem("User");
    localStorage.setItem("User",JSON.stringify(temp));
    displayTodo();
}

function deleteTodo(element)
{   
    let retrieved = JSON.parse(localStorage.getItem("User"));
    let temp = [];
    for(let i = 0;i <retrieved.length;i++)
        temp[i] = retrieved[i];
    let deleteDeadline = element.parentElement.children[0].childNodes[0].data.split("/");
    let deleteDeadlineDate = deleteDeadline[0];
    let deleteDeadlineMonth = months.indexOf(String(deleteDeadline[1]));
    let deleteDeadlineYear = parseInt(deleteDeadline[2]);
    let deleteTodoText = element.parentElement.parentElement.childNodes[0].innerText;
    temp.forEach(arr =>{
        if(arr["username"] == currentUserName)
            for(let i = 0;i < arr["todo"].length;i++)
                if(arr["todo"][i][0] == deleteDeadlineYear && arr["todo"][i][1] == deleteDeadlineMonth && arr["todo"][i][2] == deleteDeadlineDate && arr["todo"][i][3] == deleteTodoText)
                    arr["todo"].splice(i,1);
    });
    
    localStorage.removeItem("User");
    localStorage.setItem("User",JSON.stringify(temp));
    
    displayTodo();
}

function deleteTodayTodo(element)
{ 
    let retrieved = JSON.parse(localStorage.getItem("User"));
    let temp = [];
    for(let i = 0;i < retrieved.length;i++)
        temp[i] = retrieved[i];
    let deleteTodoText = element.parentElement.parentElement.childNodes[0].innerText;
    temp.forEach(arr => {
        if(arr["username"] == currentUserName)
            for(let i = 0;i < arr["todo"].length;i++)
                if(arr["todo"][i][0] == (new Date()).getFullYear() && arr["todo"][i][1] == (new Date()).getMonth() && arr["todo"][i][2] == (new Date()).getUTCDate() && arr["todo"][i][3] == deleteTodoText)
                    arr["todo"].splice(i,1);
    }); 
    localStorage.removeItem("User");
    localStorage.setItem("User",JSON.stringify(temp));
    displayTodo();
}

function completedTodo(element)
{   
    let retrieved = JSON.parse(localStorage.getItem("User"));
    let temp = [];
    for(let i = 0;i <retrieved.length;i++)
        temp[i] = retrieved[i];
    let completedDeadline = element.parentElement.children[0].childNodes[0].data.split("/");
    let completedDeadlineDate = completedDeadline[0];
    let completedDeadlineMonth = months.indexOf(String(completedDeadline[1]));
    let completedDeadlineYear = parseInt(completedDeadline[2]);
    let completedTodoText = element.parentElement.parentElement.childNodes[0].innerText;
    temp.forEach(arr =>{
        if(arr["username"] == currentUserName)
            for(let i = 0;i < arr["todo"].length;i++)
                if(arr["todo"][i][0] == completedDeadlineYear && arr["todo"][i][1] == completedDeadlineMonth && arr["todo"][i][2] == completedDeadlineDate && arr["todo"][i][3] == completedTodoText)
                    arr["todo"][i][4] = true;
    });
    
    localStorage.removeItem("User");
    localStorage.setItem("User",JSON.stringify(temp));
    displayTodo();
}

function completedTodayTodo(element){ 
    let retrieved = JSON.parse(localStorage.getItem("User"));
    let temp = [];
    for(let i = 0;i < retrieved.length;i++)
        temp[i] = retrieved[i];
    let completedTodoText = element.parentElement.parentElement.childNodes[0].innerText;
    temp.forEach(arr => {
        if(arr["username"] == currentUserName)
            for(let i = 0;i < arr["todo"].length;i++)
                if(arr["todo"][i][0] == (new Date()).getFullYear() && arr["todo"][i][1] == (new Date()).getMonth() && arr["todo"][i][2] == (new Date()).getUTCDate() && arr["todo"][i][3] == completedTodoText)
                    arr["todo"][i][4] = true;
    }); 
    localStorage.removeItem("User");
    localStorage.setItem("User",JSON.stringify(temp));  
    displayTodo();
}

function displayCalendar(month, year) {
    let tbody = document.getElementById("calendar-body");
    tbody.innerHTML = "";

    document.getElementById("month").innerText = months[month];
    document.getElementById("year").innerText = year;

    let firstDay = (new Date(year,month)).getDay();
    function monthDays(month, year)
    {
        return 32-new Date(year,month,32).getDate();
    }
    let date = 1;
    for(let i = 0;i < 6;i++)
    {
        let weekRow = document.createElement("tr");
        for(let j = 0;j < 7;j++)
        {
            if(date <= monthDays(month, year))
            {
                if(i == 0 && j < firstDay)
                {
                    let dateCell = document.createElement("td");
                    let cellText = document.createTextNode("");
                    dateCell.appendChild(cellText);
                    weekRow.appendChild(dateCell);
                }
                else
                {
                    let dateCell = document.createElement("td");
                    let cellText = document.createTextNode(date);
                    dateCell.appendChild(cellText);
                    dateCell.setAttribute("value",date);
                    dateCell.setAttribute("onclick","dateClick(this)");
                    weekRow.appendChild(dateCell);
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) 
                    {
                        dateCell.classList.add("bg-success");
                    }
                    date++;
                }
            }
            else
                break;

        }
        tbody.appendChild(weekRow);      
    }
}

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1);
    if(currentMonth === 12)
        currentMonth = 0;
    displayCalendar(currentMonth, currentYear);
}

function back() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    displayCalendar(currentMonth, currentYear);
}

function displayLoginOption()
{
    document.getElementById("login-signup").innerHTML = "";
    let loginBtn = document.createElement("button");
    let signupBtn = document.createElement("button");
    let loginText = document.createTextNode("Login");
    let signupText = document.createTextNode("Sign Up");
    loginBtn.setAttribute("onclick","loginUser()");
    signupBtn.setAttribute("onclick","addUser()");
    loginBtn.appendChild(loginText);
    signupBtn.appendChild(signupText);
    loginBtn.classList.add("btn");
    loginBtn.classList.add("btn-primary");
    signupBtn.classList.add("btn");
    signupBtn.classList.add("btn-success");
    document.getElementById("login-signup").appendChild(loginBtn);
    document.getElementById("login-signup").appendChild(signupBtn);
}

function loginUser()
{
    let div = document.getElementById("login");
    document.getElementById("signup").innerHTML = "";
    document.getElementById("login-signup").innerHTML = "";
    div.innerHTML = "";
    let labelUserName = document.createElement("label");
    let inputUserName = document.createElement("input");
    let labelPwd = document.createElement("label");
    let inputPwd = document.createElement("input");
    let loginBtn = document.createElement("button");
    let loginText = document.createTextNode("Login");
    let labelUserNameText = document.createTextNode("User Name");
    let labelPwdText = document.createTextNode("Password");
    labelUserName.appendChild(labelUserNameText);
    labelPwd.appendChild(labelPwdText);
    labelUserName.setAttribute("for","username");
    inputUserName.setAttribute("id","username");
    inputUserName.setAttribute("type","text");
    inputUserName.setAttribute("name","username");
    labelPwd.setAttribute("for","pwd");
    inputPwd.setAttribute("id","pwd");
    inputPwd.setAttribute("type","password");
    inputPwd.setAttribute("name","pwd"); 
    loginBtn.setAttribute("onclick","checkUser()");
    loginBtn.appendChild(loginText);
    loginBtn.classList.add("btn");
    loginBtn.classList.add("btn-primary");
    div.appendChild(labelUserName);
    div.appendChild(inputUserName);
    div.appendChild(labelPwd);
    div.appendChild(inputPwd);
    div.appendChild(loginBtn);
    
}

function addUser()
{
    let div = document.getElementById("signup");
    document.getElementById("login-signup").innerHTML = "";
    document.getElementById("login").innerHTML = "";
    div.innerHTML = "";
    let labelUserName = document.createElement("label");
    let inputUserName = document.createElement("input");
    let labelPwd = document.createElement("label");
    let inputPwd = document.createElement("input");
    let signupBtn = document.createElement("button");
    let signupText = document.createTextNode("Sign Up");
    let labelUserNameText = document.createTextNode("User Name");
    let labelPwdText = document.createTextNode("Password");
    labelUserName.appendChild(labelUserNameText);
    labelPwd.appendChild(labelPwdText);
    labelUserName.setAttribute("for","username");
    inputUserName.setAttribute("id","username");
    inputUserName.setAttribute("type","text");
    inputUserName.setAttribute("name","username");
    labelPwd.setAttribute("for","pwd");
    inputPwd.setAttribute("id","pwd");
    inputPwd.setAttribute("type","password");
    inputPwd.setAttribute("name","pwd"); 
    signupBtn.setAttribute("onclick","addUserIn()");
    signupBtn.appendChild(signupText);
    signupBtn.classList.add("btn");
    signupBtn.classList.add("btn-success");
    div.appendChild(labelUserName);
    div.appendChild(inputUserName);
    div.appendChild(labelPwd);
    div.appendChild(inputPwd);
    div.appendChild(signupBtn);
}

function checkUser()
{
    let username = document.getElementById("username").value;
    let pwd = document.getElementById("pwd").value;
    if(checkUserPwd(username,pwd))
    {
        currentUserName = username;
        isUserLogged = true;
        displayTodo();
    }
    else
    {
        alert("Wrong Credentials");
        displayLoginOption();
    }
}

function addUserIn()
{
    let username = document.getElementById("username").value;
    let pwd = document.getElementById("pwd").value;
    if(checkUserPwd(username,pwd) == false)
    {
        let usersDef = [];
        if(localStorage.getItem("User") == null)
            localStorage.setItem("User",JSON.stringify(usersDef));
        let retrievedUsers = JSON.parse(localStorage.getItem("User")); 
        console.log(retrievedUsers); 
        let tempUsers = [];
        for(let i = 0;i < retrievedUsers.length;i++)
            tempUsers[i] = retrievedUsers[i];
        console.log(tempUsers);
        let tempUser = new User(username,pwd);
        tempUsers.push(tempUser);
        localStorage.removeItem("User");
        console.log(tempUsers);
        localStorage.setItem("User",JSON.stringify(tempUsers));
        loginUser();  
    }
    else
    {
        alert("User Already Exists");   
        displayLoginOption();
    } 
}

function checkUserPwd(username,pwd)
{
    if(localStorage.getItem("User") != null)
    {
        let flag = 0;
        let users = JSON.parse(localStorage.getItem("User"));
        let tempUsers = [];
        for(let i = 0;i < users.length;i++)
            tempUsers[i] = users[i];
        tempUsers.forEach(arr => {
            //console.log(arr.username);
            if(arr["username"] == username && arr["pwd"] == pwd)
                flag++;    
        });

        if(flag == 1)
            return true;
        else 
            return false;
        
    }
    else
        return false;
}


startTime();
displayCalendar(currentMonth, currentYear);
if(isUserLogged == false)
{
    displayLoginOption();
}
else
{
    displayTodo();
}