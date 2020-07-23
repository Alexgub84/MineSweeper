'use strict'

function setTimer() {
    var elTimer = document.querySelector('.timer');
    var timeNow = new Date;
    gGame.secsPassed = Math.floor((timeNow.getTime() - gTimeGameBegan.getTime()) / 1000);
    if (gGame.secsPassed < 100) gGame.secsPassed = (gGame.secsPassed < 10) ? '00' + gGame.secsPassed : '0' + gGame.secsPassed;
    elTimer.innerText = gGame.secsPassed;
}


function getIntNotInc(min = 0, max = 10) {
    return Math.floor(Math.random() * (max - min) + min);
}