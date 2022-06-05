let params = new URLSearchParams(window.location.search);
let gameId = params.get("gameId");
let gameData;
let chosenColour;
let playersColour;
let currentPiecePositions;
let selectedSquare;

//canvas
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

function drawPieces(pieces) {
  let pieceColor;
  let pieceType;
  for (r = 0; r < 8; r++) {
    for (c = 0; c < 8; c++) {
      console.log(pieces[r][c]);
      if (pieces[r][c] != null) {
        if (pieces[r][c].color == "w") {
          pieceColour = "white";
        } else if (pieces[r][c].color == "b") {
          pieceColour = "black";
        }

        if (pieces[r][c].type == "p") {
          pieceType = "pawn";
        } else if (pieces[r][c].type == "k") {
          pieceType = "king";
        } else if (pieces[r][c].type == "q") {
          pieceType = "queen";
        } else if (pieces[r][c].type == "r") {
          pieceType = "rook";
        } else if (pieces[r][c].type == "n") {
          pieceType = "knight";
        } else if (pieces[r][c].type == "b") {
          pieceType = "bishop";
        }

        ctx.drawImage(
          document.getElementById(pieceType + "_" + pieceColour),
          c * 50,
          r * 50,
          boardSize,
          boardSize
        );
      }
    }
  }
}

function refreshBoard() {
  if (gameId !== null) {
    fetch(`/api/getGame/${gameId}`).then(function (response) {
      //gets game data from database
      response.json().then((response) => {
        if (response) {
          gameData = response;

          //get piece positions
          fetch(`/api/getPieceLocations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fen: response.current_positions,
            }),
          }).then(function (response) {
            response.json().then((response) => {
              currentPiecePositions = response;

              drawPieces(currentPiecePositions);
            });
          });
        }
      });
    });
  }
}

function makeMove(fen, from, to) {
  fetch(`/api/makeMove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fen: fen,
      from: from,
      to: to,
    }),
  }).then(function (response) {
    response.json().then((response) => {
      console.log(response);
      if (response.fen !== "none") {
        //call api to update database
        //set selectedsquare to null
        //send signal to websocket
        //call drawboard
        //call getPieceLocations api with new fen
        //call draw pieces

        //update database
        fetch(`/api/updateGame`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: gameId,
            fen: response.fen,
          }),
        }).then(function () {
          selectedSquare = null;

          //redraw board
          drawBoard(boardSize);
          refreshBoard();
        });
      }
    });
  });
}

c.addEventListener(
  "click",
  function (event) {
    var x = event.offsetX;
    var y = event.offsetY;
    let chessBoardY = 8 - Math.floor(y / boardSize);
    let chessBoardX = String.fromCharCode(96 + Math.ceil(x / boardSize));
    let chessCoodinates = chessBoardX + chessBoardY.toString();

    // console.log(chessCoodinates);
    // console.log(currentPiecePositions);

    fetch(`/api/getSquare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fen: gameData.current_positions,
        coordinates: chessCoodinates,
      }),
    }).then(function (response) {
      response.json().then((response) => {
        if (response.type != "none") {
          selectedSquare = chessCoodinates;
          console.log(selectedSquare);
          //call function to show valid moves
        } else if (selectedSquare != null) {
          makeMove(gameData.current_positions, selectedSquare, chessCoodinates); // attempt to make move from selected square to chessCoordinates
        }
      });
    });
  },
  false
);

drawBoard(boardSize);

if (gameId !== null) {
  fetch(`/api/getGame/${gameId}`).then(function (response) {
    //gets game data from database
    response.json().then((response) => {
      if (response) {
        gameData = response;
        document.getElementById("pickColour").classList.remove("hide");
        document.getElementById("startButtons").classList.add("hide");
        document.getElementById("leaveBtn").classList.remove("hide");

        //get piece positions
        fetch(`/api/getPieceLocations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fen: response.current_positions,
          }),
        }).then(function (response) {
          response.json().then((response) => {
            currentPiecePositions = response;

            drawPieces(currentPiecePositions);
          });
        });
      }
    });
  });
}

let setPasswordForm = document.getElementById("setPassword");
let inputPasswordForm = document.getElementById("passwordInput");

document.getElementById("whiteBtn").addEventListener("click", (event) => {
  chosenColour = "white";
  document.getElementById("colourBtns").classList.add("hide");
  if (gameData.white_password == null) {
    setPasswordForm.classList.remove("hide");
  } else {
    inputPasswordForm.classList.remove("hide");
  }
});

document.getElementById("blackBtn").addEventListener("click", (event) => {
  chosenColour = "black";
  document.getElementById("colourBtns").classList.add("hide");
  if (gameData.black_password == null) {
    setPasswordForm.classList.remove("hide");
  } else {
    inputPasswordForm.classList.remove("hide");
  }
});

setPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let newPassword = new FormData(setPasswordForm).get("newPassword");

  fetch(`/api/setPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newPassword: newPassword,
      player: chosenColour,
      gameId: gameId,
    }),
  }).then(function () {
    playersColour = chosenColour;
    document.getElementById("pickColour").classList.add("hide");
  });
});

inputPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let password = new FormData(inputPasswordForm).get("password");

  fetch(`/api/checkPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: password,
      player: chosenColour,
      gameId: gameId,
    }),
  }).then(function (response) {
    response.json().then((response) => {
      if (response.password_match == true) {
        document.getElementById("pickColour").classList.add("hide");
      } else {
      }
    });
  });
});
