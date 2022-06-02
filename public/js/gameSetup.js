let params = new URLSearchParams(window.location.search);
let gameId = params.get("gameId");
let gameData;
let chosenColour;
let playersColour;

if (gameId !== null) {
  fetch(`/api/getGame/${gameId}`).then(function (response) {
    response.json().then((response) => {
      if (response) {
        gameData = response;
        document.getElementById("pickColour").classList.remove("hide");
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
});
inputPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
//get password set form
//on event submit
//if chosen colour black
//set password api request (gameid, "black", password)
//set player colour
//else
//set password api request (gameid, "white", password)
//set player colour

//get password input form
//on event submit
//if chosen colour black
//check password api request (gameid, "black", password)
//.then( if response == true
//set player colour
//else
//display error msg
//else
//check password api request (gameid, "white", password)
//.then( if response == true
//set player colour
//else
//display error msg