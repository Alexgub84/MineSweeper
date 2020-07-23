'use strict'


//    gBoard[i][j].minesAroundCount+=1;
//     gBoard[i][j].isShown = false;
//     gBoard[i][j].isMine =  true;
//     gBoard[i][j].isMarked =  false;

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
    strHtml += `<td id="cell-${coord.i}-${coord.j}" class="cell cell-${cell.minesAroundCount} ${cellSpecialClassName}" ${functions} data-i="${coord.i}" data-j="${coord.j}">
${cellText}</td>`;

    return strHtml;
}

function buildBoard(mines) {
    buileEmptyBoard();

    for (let count = 0; count < mines.length; count++) {
        var mineI = mines[count].i;
        var mineJ = mines[count].j;
        gBoard[mineI][mineJ].isMine = true;
        setMineNegsCount({ i: mineI, j: mineJ });
    }
    console.log(gBoard);
}

function buileEmptyBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = getCell();
        }
    }
}

function getCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

function creatRandomMines(notMineCoord) {
    console.log('Mines are:');
    var mines = [];
    while (mines.length < gLevel.MINES) {
        var newMine = {};
        newMine.i = getIntNotInc(0, gLevel.SIZE);
        newMine.j = getIntNotInc(0, gLevel.SIZE);
        if ((notMineCoord.i !== newMine.i && notMineCoord.j !== newMine.j) && (checkIfMineLegit(mines, newMine))) {
            mines.push(newMine);
            console.log(`${newMine.i }-${newMine.j}`);
        }
    }

    return mines;
}

function checkIfMineLegit(mines, mineCoord) {
    for (let i = 0; i < mines.length; i++) {
        if (mines[i].i === mineCoord.i && mines[i].j === mineCoord.j)
            return false;
    }
    return true;
}

function setMineNegsCount(mineCoord) {
    for (let i = mineCoord.i - 1; i <= mineCoord.i + 1; i++) {
        for (let j = mineCoord.j - 1; j <= mineCoord.j + 1; j++) {
            if (i === mineCoord.i && j === mineCoord.j) continue;
            if (_checkIfOnBoard({ i: i, j: j })) {
                gBoard[i][j].minesAroundCount += 1;
            }
        }
    }
}

function _checkIfOnBoard(cellCoord) {
    return (cellCoord.i >= 0 && cellCoord.i < gBoard.length &&
        cellCoord.j >= 0 && cellCoord.j < gBoard[cellCoord.i].length);
}

function showAllMines() {

}