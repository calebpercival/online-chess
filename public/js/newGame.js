function newGame() {
  return fetch("/api/newGame", {
    method: "POST",
  }).then(function (res) {
    res.json().then((response) => {
      console.log(response.id);
      window.location = "/?gameId=" + response.id;
    });
  });
}
