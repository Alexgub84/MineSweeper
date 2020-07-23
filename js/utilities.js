'use strict'

function setTimer() {
    var elTimer = document.querySelector('.timer');
    var timeNow = new Date;
    gGame.secsPassed = Math.floor((timeNow.getTime() - gTimeGameBegan.getTime()) / 1000);
    if (gGame.secsPassed < 100) gGame.secsPassed = (gGame.secsPassed < 10) ? '00' + gGame.secsPassed : '0' + gGame.secsPassed;
    elTimer.innerText = gGame.secsPassed;
}


function getIntNotInc(min = 0, max = gLevel.SIZE) {
    return Math.floor(Math.random() * (max - min) + min);
}

function copyMat(sourceMat) {
    var newMat = [];
    for (var i = 0; i < sourceMat.length; i++) {
        var arr = []
        for (let j = 0; j < sourceMat[i].length; j++) {
            var sourceObj = sourceMat[i][j];
            var obj = Object.assign({}, sourceObj)
            arr.push(obj);
        }
        newMat.push(arr);
    }
    return newMat;
}