let params = new URLSearchParams(window.location.search);
let gameId = params.get("gameId");
let gameData;
let chosenColour;
let playersColour;
let currentPiecePositions;

if (gameId !== null) {
  fetch(`/api/getGame/${gameId}`).then(function (response) {
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
            console.log(currentPiecePositions);
          });
        });
      }
    });
  });
}
//   //get piece positions
//   fetch(`/api/getPieceLocations`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       fen: gameData.current_positions,
//     }),
//   }).then(function (response) {
//     response.json().then((response) => {
//       currentPiecePositions = response;
//       console.log(currentPiecePositions);
//     });
//   });

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
