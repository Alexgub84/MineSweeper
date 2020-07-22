'use strict'

function setTimer() {
    var elTimer = document.querySelector('.timer');
    var timeNow = new Date;
    var seconds = Math.floor((timeNow.getTime() - gTimeGameBegan.getTime()) / 1000);
    if (seconds < 100) seconds = (seconds < 10) ? '00' + seconds : '0' + seconds;
    elTimer.innerText = seconds;
}


function getIntNotInc(min = 0, max = 10) {
    return Math.floor(Math.random() * (max - min) + min);
}