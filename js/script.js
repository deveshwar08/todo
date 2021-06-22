let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let clockType = "digital";
let digitalDiv = '<div id="time" style="font-family: \'Orbitron\', sans-serif;"></div>';
let analogueDiv = '<div id="analogue-clock"><canvas id="analogue-canvas" width="400px" height="400px"></canvas></div>';
document.getElementById("clock-area").innerHTML = digitalDiv;
let defaultTodo = [];

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

function displayTodo()
{
    let ul = document.getElementById("todo-list");
    ul.innerHTML = "";
    if(localStorage.getItem("Todo") == null)
        localStorage.setItem("Todo",JSON.stringify(defaultTodo));
    else{
        let retrievedTodo = JSON.parse(localStorage.getItem("Todo"));
        let tempTodo = [];
        for(let i = 0;i < retrievedTodo.length;i++)
            tempTodo[i] = retrievedTodo[i].slice();
        //console.log(tempTodo);
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
            //li.classList.add("align-items-center");
            let todoText = document.createTextNode(arr[3]);
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
            li.appendChild(todoText);
            li.appendChild(div);
            ul.appendChild(li); 
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
    let retrievedTodo = JSON.parse(localStorage.getItem("Todo"));
    let tempTodo = [];
    for(let i = 0;i < retrievedTodo.length;i++)
        tempTodo[i] = retrievedTodo[i].slice();
    tempTodo.push([year,month,date,todo]);
    localStorage.removeItem("Todo");
    localStorage.setItem("Todo",JSON.stringify(tempTodo));
    displayTodo();
}

function deleteTodo(element)
{
    let retrievedTodo = JSON.parse(localStorage.getItem("Todo"));
    let tempTodo = [];
    for(let i = 0;i < retrievedTodo.length;i++)
        tempTodo[i] = retrievedTodo[i].slice();
    let deleteDeadline = element.parentElement.children[0].childNodes[0].data.split("/");
    let deleteDeadlineDate = deleteDeadline[0];
    let deleteDeadlineMonth = months.indexOf(String(deleteDeadline[1]));
    let deleteDeadlineYear = parseInt(deleteDeadline[2]);
    let deleteTodoText = element.parentElement.parentElement.childNodes[0].data;
    for(let i = 0;i < tempTodo.length;i++)
    {
        if(tempTodo[i][0] == deleteDeadlineYear && tempTodo[i][1] == deleteDeadlineMonth && tempTodo[i][2] == deleteDeadlineDate && tempTodo[i][3] == deleteTodoText)
            tempTodo.splice(i,1);
    }
    localStorage.removeItem("Todo");
    localStorage.setItem("Todo",JSON.stringify(tempTodo));    
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
startTime();
displayCalendar(currentMonth, currentYear);
displayTodo();