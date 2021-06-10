let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    h = h < 10 ? "0"+h : h;
    m = m < 10 ? "0"+m : m;
    s = s < 10 ? "0"+s : s;
    displayTime = h + ":" + m + ":" + s;
    document.getElementById('time').innerHTML = displayTime;
    t = setTimeout(function() {
        startTime()
    }, 500);

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
                    dateCell.setAttribute("onclick","addTodo(date,month,year)")
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

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    displayCalendar(currentMonth, currentYear);
}
startTime();
displayCalendar(currentMonth, currentYear);