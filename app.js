const express = require("express");
const UUID = require("uuid");
const app = express();
const server = require("http").createServer(app);
const port = 6060;

const games = require("./src/games.js");
const chessGame = require("./src/chessGame.js");

const WebSocket = require("ws");
const { response } = require("express");
const wss = new WebSocket.Server({ server: server });

// const { default: Chess } = await import("chess.js");

wss.on("connection", function connection(ws) {
  console.log("new client connected");
  ws.send("welcome new client");

  ws.on("message", function incoming(data) {
    console.log("recieved: %s", data);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        let message = JSON.parse(data).message;
        client.send(JSON.stringify({ message }));
      }
    });
  });
});

//serve html, js, css from public folder
app.use(express.static("public"));
app.use(express.json());

// app.get("/:id", function (req, res) {
//   games.getGame(req.params.id, callback);
// });

app.post("/api/newGame", function (req, res) {
  let newId;
  let existingId;
  do {
    newId =
      Math.random().toString(36).substring(2, 6) +
      Math.random().toString(36).substring(2, 6);
    games.getById(newId, (testRes) => {
      if (testRes === undefined) {
        games.newGame(newId, (result) => {
          res.send({ id: result });
        });
      } else {
        existingId = testRes.id;
      }
    });
  } while (existingId == newId);
});

app.get("/api/getGame/:id", function (req, res) {
  games.getById(req.params.id, (response) => {
    res.send(response);
  });
});

app.post("/api/setPassword", function (req, res) {
  games.setPassword(req.body.newPassword, req.body.player, req.body.gameId);
  res.send({});
});

app.post("/api/checkPassword", function (req, res) {
  games.checkPassword(
    req.body.password,
    req.body.player,
    req.body.gameId,
    (response) => {
      res.send(response);
    }
  );
});

app.post("/api/getPieceLocations", async function (req, res) {
  let currentBoard = await chessGame.getPieceLocations(req.body.fen);
  res.send(currentBoard);
});

app.post("/api/getSquare", async function (req, res) {
  //returns piece on square
  let piece = await chessGame.getSquareStatus(
    req.body.fen,
    req.body.coordinates
  );
  if (piece == null) {
    res.send({ type: "none" });
  } else {
    res.send(piece);
  }
});

console.log("Server running on http://localhost:" + port);
server.listen(port);
