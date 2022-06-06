let params = new URLSearchParams(window.location.search);
let gameId = params.get("gameId");
let gameData;
let chosenColour;
let playersColour;
let currentPiecePositions;
let selectedSquare;

document.getElementById("gameLink").textContent =
  "Join link: http://localhost:6060/?gameId=" + gameId;
document.getElementById("Id").textContent = "Your Game ID is: " + gameId;
//websocket
const socket = new WebSocket("ws://localhost:6060");

socket.addEventListener("open", function (event) {
  console.log("connected to websocket server");
});

const sendMessage = () => {
  socket.send(
    JSON.stringify({ type: "message", message: "Test sending a message" })
  );
};

const sendMove = () => {
  socket.send(JSON.stringify({ type: "refresh", gameId: gameId }));
};

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

function displayStatus(status) {
  let winner;

  document.getElementById("outcome").textContent = status;

  if (status == "Draw") {
    document.getElementById("outcome").textContent = "Game Over! It's a Draw";
  } else if (status == "Checkmate") {
    fetch(`/api/getGame/${gameId}`).then(function (response) {
      response.json().then((response) => {
        fetch(`/api/currentTurn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fen: response.current_positions,
          }),
        }).then(function (response) {
          response.json().then((response) => {
            if (response.colour == "w") {
              winner = "Black";
            } else {
              winner = "White";
            }

            document.getElementById("outcome").textContent =
              status + "! " + winner + " Wins";
          });
        });
      });
    });
  }
}

function displayTurn() {
  //display what players turn it is
  if (gameId !== null) {
    fetch(`/api/getGame/${gameId}`).then(function (response) {
      //gets game data from database
      response.json().then((response) => {
        fetch(`/api/currentTurn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fen: response.current_positions,
          }),
        }).then(function (response) {
          response.json().then((response) => {
            if (response.colour == "w") {
              document.getElementById("turn").textContent = "White's Turn";
            } else {
              document.getElementById("turn").textContent = "Black's Turn";
            }
          });
        });
      });
    });
  }
}

displayTurn();

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

          //test for game over
          fetch(`/api/gameStatus`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fen: response.current_positions,
            }),
          }).then(function (response) {
            response.json().then((response) => {
              console.log(response);

              displayStatus(response.status);

              fetch(`/api/setStatus`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  gameId: gameId,
                  status: response.status,
                }),
              });
            });
          });
          displayTurn();
          displayStatus(response.status);
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
      if (response.fen !== "none") {
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

          //send signal to websocket
          sendMove();
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
        if (response.type != "none" && response.color == playersColour[0]) {
          selectedSquare = chessCoodinates;
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
        document.getElementById("inGameButtons").classList.remove("hide");

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

        //test for game over
        fetch(`/api/gameStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fen: response.current_positions,
          }),
        }).then(function (response) {
          response.json().then((response) => {
            console.log(response);

            displayStatus(response.status);

            fetch(`/api/setStatus`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                gameId: gameId,
                status: response.status,
              }),
            });
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
        playersColour = chosenColour;
        document.getElementById("pickColour").classList.add("hide");
      } else {
      }
    });
  });
});

socket.onmessage = function (event) {
  console.log(JSON.parse(event.data).message.type);
  if (JSON.parse(event.data).message.type == "refresh") {
    if (JSON.parse(event.data).message.gameId == gameId) {
      ctx.clearRect(0, 0, boardSize * 8, boardSize * 8);
      drawBoard(boardSize);
      refreshBoard();
    }
  }
};
