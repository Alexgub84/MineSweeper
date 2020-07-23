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
    //const REDMINE_IMG = '<img src="images/redmine.jpg" alt="M">'
const FLAG_IMG = '<img src="images/flag.png" alt="F">'

var gBoard = [];
var gLevel = { SIZE: 8, MINES: 12 };
var gGame = {};
var gSpecial = {
    isHintOn: false,
    hints: 3,
    isLifesOn: false,
    lifes: 3,
    safeClicks: 3,
    stepsMemory: [{},
        []
    ]
}

var gTimer;
var gTimeGameBegan;
var gHintTimer;
var gFirstMoveFlaged = {};


function init() {
    //nulify everything and build empty bord

    gGame = {
        isOn: false,
        isLost: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    //reset special
    gSpecial = {
        isHintOn: false,
        hints: 3,
        isLifesOn: false,
        lifes: 3,
        safeClicks: 3,
    };
    resetControlOptions();
    gFirstMoveFlaged = { i: -1, j: -1 };
    if (gTimer) clearInterval(gTimer);
    document.querySelector('.timer').innerText = '000';
    document.querySelector('.count').innerText = gLevel.MINES;

    buileEmptyBoard();
    renderBoard();
}

function startGame(notMineCoord = { i: -1, j: -1 }) {
    // if (gManualMines.length > 0) {
    //     gGame.isOn = true;
    //     gTimeGameBegan = new Date;
    //     gTimer = setInterval(setTimer, 1000);
    //     saveNextMove();
    //     return;
    // }
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
    saveNextMove();
}

function playerLose(coords) {

    gGame.isOn = false;
    gGame.isLost = true;
    //reset button and timer
    var elButton = document.querySelector('.reset');
    elButton.innerText = LOST;
    clearInterval(gTimer);

    //show all mines and color the clicked to red
    showAllMines(coords);


}

function playerWin() {

    gGame.isOn = false;
    var elButton = document.querySelector('.reset');
    elButton.innerText = WIN;
    clearInterval(gTimer);

}

function showAllMines(coords) {

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            switch (cell.isMine) {
                case true:
                    cell.isShown = true;

                    if (cell.isMarked) cell.isMarked = false;
                    break;
                case false:
                    //cell.isShown = true;
                    break;
                default:
                    break;
            }
        }
    }
    renderBoard();
    document.querySelector(`#cell-${coords.i}-${coords.j}`).style.backgroundColor = "red";
}

function openAllEmptyCells(coord) {
    for (let i = (coord.i - 1); i <= (coord.i + 1); i++) {
        for (let j = (coord.j - 1); j <= (coord.j + 1); j++) {

            if (i === coord.i && j === coord.j) continue;
            if (_checkIfOnBoard({ i: i, j: j }) && !gBoard[i][j].isMine && !gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
                if (gBoard[i][j].minesAroundCount === 0) openAllEmptyCells({ i: i, j: j });
            }
        }
    }
}

function cellClicked(elCell) {
    // if (gIsSettingMines) {
    //     var coords = { i: +elCell.dataset.i, j: +elCell.dataset.j };
    //     var newMine = { i: coords.i, j: coords.j };
    //     gManualMines.push(newMine);
    //     if ((gManualMines.length - 1) === gLevel.MINES) {
    //         gIsSettingMines = false;
    //         buildBoard(gIsSettingMines);
    //         renderBoard();
    //     }
    // }
    if (gGame.isLost) return;
    var cell = gBoard[elCell.dataset.i][elCell.dataset.j];
    var coords = { i: +elCell.dataset.i, j: +elCell.dataset.j };
    if (gSpecial.isHintOn && cell.isHinted) {
        cell.isShown = true;
        showHintedCells(coords);
        return;
    }

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
        console.log('Sending click coord to start a game: ' + coords.i + ':' + coords.j);
        startGame(coords);
        cellClicked(elCell);
        return;
    }

    if (gBoard[coords.i][coords.j].isMine) {
        //player lose
        gBoard[coords.i][coords.j].isShown;
        if (gSpecial.isLifesOn) {
            updateLife();
        } else {
            playerLose(coords);
            return;
        }
    }

    if (!cell.isShown) {
        cell.isShown = true;
        gGame.shownCount++;
        //check is Winner
        if (cell.minesAroundCount === 0) openAllEmptyCells(coords);
    }
    renderBoard();
    saveNextMove();
    //check if won
    if ((gLevel.MINES === gGame.markedCount) && (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES))) playerWin();

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
        saveNextMove();
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

    saveNextMove();
    if ((gLevel.MINES === gGame.markedCount) && (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)))
        playerWin();
}

function resetGame(elButton) {
    console.clear();
    elButton.innerText = RESET;
    init();
}

function showHintedCells(coords) {
    for (let i = (coords.i - 1); i <= (coords.i + 1); i++) {
        for (let j = (coords.j - 1); j <= (coords.j + 1); j++) {

            if (i === coords.i && j === coords.j) continue;
            if (_checkIfOnBoard({ i: i, j: j }) && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
            }
        }
    }
    renderBoard();
    gHintTimer = setInterval(hideHinted, 1000);
}

function hideHinted() {
    gBoard = copyMat(gTempBoard);
    renderBoard();
    clearInterval(gHintTimer);
    gSpecial.isHintOn = false;
}