function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = h < 10 ? "0"+h : h;
    m = m < 10 ? "0"+m : m;
    s = s < 10 ? "0"+s : s;
    displayTime = h + ":" + m + ":" + s;
    document.getElementById('time').innerHTML = displayTime;
    t = setTimeout(function() {
        startTime()
    }, 500);
}
startTime();