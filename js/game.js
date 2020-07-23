'use strict'

const MINE = 'M';
// const MINE = '💣'
const FLAG = 'F';
// const FLAG = '🎌';
const EMPTY = 0;
const LOST = '👻';
const RESET = '😎';
const WIN = '🤩';

const MINE_IMG = '<img src="images/mine.png" alt="M">'
const REDMINE_IMG = '<img src="images/redmine.jpg" alt="M">'
const FLAG_IMG = '<img src="images/flag.png" alt="F">'





var gBoard = [];
var gLevel = { SIZE: 5, MINES: 2 };
var gGame = {};

var gTimer;
var gTimeGameBegan;
var gFirstMoveFlaged = {};

//     gBoard[i][j].minesAroundCount += 1;
//     gBoard[i][j].isShown = false;
//     gBoard[i][j].isMine =  true;
//     gBoard[i][j].isMarked =  false;



function init() {
    //nulify everything and build empty bord
    console.log(gGame);
    gGame = {
        isOn: false,
        isLost: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gFirstMoveFlaged = { i: -1, j: -1 };
    if (gTimer) clearInterval(gTimer);
    document.querySelector('.timer').innerText = '000';
    document.querySelector('.count').innerText = gLevel.MINES;

    buileEmptyBoard();
    renderBoard();
}

function startGame(notMineCoord = { i: -1, j: -1 }) {
    var mines = creatRandomMines(notMineCoord);
    buildBoard(mines);

    //if first move was flaged
    if (gFirstMoveFlaged.i !== -1) {
        gBoard[gFirstMoveFlaged.i][gFirstMoveFlaged.j].isMarked = true;
    }
    renderBoard();
    gGame.isOn = true;
    gTimeGameBegan = new Date;
    gTimer = setInterval(setTimer, 1000);
}

function playerLose(elCell) {
    console.log("You lost");
    gGame.isOn = false;
    gGame.isLost = true;

    elCell.innerHTML = REDMINE_IMG;
    var elButton = document.querySelector('.reset');
    elButton.innerText = LOST;
    clearInterval(gTimer);
}

function playerWin() {
    console.log('Player win');
    gGame.isOn = false;
    var elButton = document.querySelector('.reset');
    elButton.innerText = WIN;
    clearInterval(gTimer);
}

function openAllEmptyCells(coord) {
    for (let i = (coord.i - 1); i <= (coord.i + 1); i++) {
        for (let j = (coord.j - 1); j <= (coord.j + 1); j++) {

            if (i === coord.i && j === coord.j) continue;
            if (_checkIfOnBoard({ i: i, j: j }) && !gBoard[i][j].isMine && !gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
            }
        }
    }
    console.log(gBoard);
}

function cellClicked(elCell) {

    if (gGame.isLost) return;

    var cell = gBoard[elCell.dataset.i][elCell.dataset.j];
    var coord = { i: +elCell.dataset.i, j: +elCell.dataset.j };

    //if first move after setting a flag and it hit a mine
    if (gGame.markedCount === 1 && gGame.shownCount === 0 && cell.isMine) {
        console.log('First click after flag');
        startGame(coord);
        cellClicked(elCell);
        return;
    }
    //if cell is marked 
    if (cell.isMarked) return;

    //if frist click without setting a flag
    if (!gGame.isOn) {
        //add if there is no a flag
        console.log('Sending click coord to start a game: ' + coord.i + ':' + coord.j);
        startGame(coord);
        cellClicked(elCell);
        return;
    }

    if (gBoard[coord.i][coord.j].isMine) {
        //player lose
        playerLose(elCell);
        return;
    }

    if (!cell.isShown) {
        cell.isShown = true;
        gGame.shownCount++;
        //check is Winner

        if ((gLevel.MINES === gGame.markedCount) && (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES))) {
            playerWin();
            return;
        } else if (cell.minesAroundCount === 0) openAllEmptyCells(coord);
        //check if won after opening all enpty cells
        console.log((gLevel.MINES === gGame.markedCount));
        console.log(gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES));
        if ((gLevel.MINES === gGame.markedCount) && (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)))
            playerWin();
    }
    console.log(gGame);
    renderBoard();

}

function rightClicked(elCell) {

    if (gGame.isLost) return;

    if (!gGame.isOn) {

        //if it's the first move
        gFirstMoveFlaged.i = elCell.dataset.i;
        gFirstMoveFlaged.j = elCell.dataset.j;

        startGame();
        var cell = gBoard[gFirstMoveFlaged.i][gFirstMoveFlaged.j];
        console.log(cell);
        cell.isMarked = true;

        elCell = document.querySelector(`#cell-${gFirstMoveFlaged.i}-${gFirstMoveFlaged.j}`)
        console.log(elCell);
        elCell.innerHTML = FLAG_IMG;

        gGame.markedCount++;
        var updatedCount = (gLevel.MINES - gGame.markedCount);
        updatedCount = (updatedCount < 10) ? ('0' + updatedCount) : updatedCount;
        document.querySelector('.count').innerText = updatedCount;
        return;
    }

    var cell = gBoard[elCell.dataset.i][elCell.dataset.j];
    var coord = { i: +elCell.dataset.i, j: +elCell.dataset.j };

    //if game is already on
    if (!cell.isMarked) {
        elCell.innerHTML = FLAG_IMG;
        gGame.markedCount++;
    } else {
        elCell.innerHTML = '';
        gGame.markedCount--;
    }

    cell.isMarked = !cell.isMarked;
    var updatedCount = (gLevel.MINES - gGame.markedCount);
    updatedCount = (updatedCount < 10) ? ('0' + updatedCount) : updatedCount;
    document.querySelector('.count').innerText = updatedCount;

    console.log((gLevel.MINES === gGame.markedCount));
    console.log(gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES));
    if ((gLevel.MINES === gGame.markedCount) && (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)))
        playerWin();
}

function resetGame(elButton) {
    console.clear();
    elButton.innerText = RESET;
    init();
}