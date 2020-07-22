'use strict'

const MINE = 'M';
const FLAG = 'F';
const EMPTY = 0;

const MINE_IMG = '<img src="images/mine.png" alt="M">'
const REDMINE_IMG = '<img src="images/redmine.jpg" alt="M">'
const FLAG_IMG = '<img src="images/flag.png" alt="F">'


const LOST = '👻';
const RESET = '😎';


var gBoard = [];
var gLevel = { SIZE: 10, MINES: 10 };
var gGame = {
    isOn: false,
    isLost: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gTimer;
var gTimeGameBegan;

//     gBoard[i][j].minesAroundCount += 1;
//     gBoard[i][j].isShown = false;
//     gBoard[i][j].isMine =  true;
//     gBoard[i][j].isMarked =  false;



function init() {
    gGame.isLost = false;
    document.querySelector('.timer').innerText = '000';
    document.querySelector('.count').innerText = gLevel.MINES;

    buileEmptyBoard();
    renderBoard();
}

function startGame(notcoord) {

    var mines = creatRandomMines(notcoord);
    buildBoard(mines);
    renderBoard();
    gTimeGameBegan = new Date;
    console.log(gTimeGameBegan.getSeconds);
    gTimer = setInterval(setTimer, 1000);
}

function playerLose(elCell) {
    console.log("You lost");
    gGame.isOn = false;
    gGame.isLost = true;
    var cell = gBoard[elCell.dataset.i][elCell.dataset.j];
    var coord = { i: +elCell.dataset.i, j: +elCell.dataset.j };
    elCell.innerHTML = REDMINE_IMG;
    var elButton = document.querySelector('.reset');
    elButton.innerText = LOST;
    clearInterval(gTimer);

}


function cellClicked(elCell) {
    if (gGame.isLost) return;
    var cell = gBoard[elCell.dataset.i][elCell.dataset.j];
    var coord = { i: +elCell.dataset.i, j: +elCell.dataset.j };
    if (gBoard[coord.i][coord.j].isMine) {
        //player lose
        playerLose(elCell);
        return;
    }
    if (!gGame.isOn) {
        startGame(cell);
        gGame.isOn = true;
        cellClicked(elCell);
        return;
    }
    if (!cell.isShown) {
        cell.isShown = true;
        gGame.shownCount++;
        openAllNotMIneCells(coord);
    }
    renderBoard();

}

function rightClicked(elCell) {
    if (gGame.isLost) return;
    var cell = gBoard[elCell.dataset.i][elCell.dataset.j];
    var coord = { i: +elCell.dataset.i, j: +elCell.dataset.j };

    if (!cell.isMarked) {
        elCell.innerHTML = FLAG_IMG;
        gGame.markedCount++;
    } else {
        elCell.innerHTML = '';
        gGame.markedCount--;
    }
    var updatedCount = (gLevel.MINES - gGame.markedCount);
    updatedCount = (updatedCount < 10) ? ('0' + updatedCount) : updatedCount;
    document.querySelector('.count').innerText = updatedCount;
}

function resetGame(elButton) {
    if (gGame.isLost) {
        elButton.innerText = RESET;
        init();
    }
}

function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        var row = gBoard[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            strHtml += getNewHtmlForCell({ i: i, j: j });

            // var cell = '';
            // if (row[j].isShown) {
            //     if (row[j].isMine) {
            //         cell = MINE;
            //         var className = 'mine';
            //     } else {
            //         cell = (row[j].minesAroundCount > 0) ? row[j].minesAroundCount : '';
            //         var className = `cell-${row[j].minesAroundCount}`;
            //     }
            // } else {
            //     var className = 'hidden';
            //     if (row[j].isMarked) className += ' marked';
            // }

            // strHtml += `<td class="cell cell${i}-${j} ${className}" onclick="cellClicked(this)" data-i="${i}" data-j="${j}">
            //                 ${cell}
            //             </td>`;
        }
        strHtml += '</tr>';
    }
    //edit element class name
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function openAllNotMIneCells(coord) {
    console.log('clicked: ' + coord.i + coord.j);
    console.log(coord);
    for (let i = (coord.i - 1); i <= (coord.i + 1); i++) {
        for (let j = (coord.j - 1); j <= (coord.j + 1); j++) {
            console.log('checking: ' + i + ':' + j);
            if (i === coord.i && j === coord.j) continue;
            if (_checkIfOnBoard({ i: i, j: j }) && !gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true;
                gGame.shownCount++;

            }
        }
    }
    console.log(gBoard);
}

function renderCell(elCell) {
    // var elCell = document.querySelector(`.cell${coord.i}-${coord.j}`);

    // elCell.innerHTML = getNewHtmlForCell(coord);
    elCell.innerHTML = '1';

}

function getNewHtmlForCell(coord) {
    var cell = gBoard[coord.i][coord.j];
    var strHtml = '';
    var cellText = '';

    var cellSpecialClassName = ''
    if (cell.isShown) {
        //for shown cells
        if (cell.isMine) {
            cellSpecialClassName = 'mine';
            cellText = MINE_IMG;
        } else {
            cellText = (cell.minesAroundCount > 0) ? cell.minesAroundCount : '';
        }
    } else {
        //for not shown cells
        cellSpecialClassName = 'hidden';
        if (cell.isMarked) cellText = FLAG_IMG;
    }
    //onmousedown ="mouseDown(this)
    var functions = 'onclick="cellClicked(this)" oncontextmenu = "rightClicked(this)"'
    strHtml += `<td class="cell cell-${cell.minesAroundCount} ${cellSpecialClassName}" ${functions} data-i="${coord.i}" data-j="${coord.j}">
${cellText}</td>`;

    return strHtml;
}