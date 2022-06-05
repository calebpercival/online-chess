var c = document.getElementById("chessBoard");
var ctx = c.getContext("2d");

let boardSize = 50;

function drawBoard(boardSize) {
  for (row = 0; row < 8; row++) {
    for (col = 0; col < 8; col++) {
      if (row % 2 == 0) {
        if (col % 2 == 0) {
          ctx.fillStyle = "white";
        } else {
          ctx.fillStyle = "#444444";
        }
      } else {
        if (col % 2 == 0) {
          ctx.fillStyle = "#444444";
        } else {
          ctx.fillStyle = "white";
        }
      }
      ctx.fillRect(boardSize * col, boardSize * row, boardSize, boardSize);
    }
  }
}

c.addEventListener(
  "click",
  function (event) {
    var x = event.offsetX;
    var y = event.offsetY;
    let chessBoardY = 8 - Math.floor(y / boardSize); //toString(y / boardSize);
    let chessBoardX = String.fromCharCode(96 + Math.ceil(x / boardSize));
    let chessCoodinates = chessBoardX + chessBoardY.toString();
    console.log(chessCoodinates);
  },
  false
);

// function drawKing

function drawPieces() {
  let whiteKing = new Image();
  whiteKing.src = "./images/king_white.png";

  whiteKing.onload = function () {
    ctx.drawImage(whiteKing, 0, 0, boardSize, boardSize);
  };
}

drawBoard(boardSize);
drawPieces();
