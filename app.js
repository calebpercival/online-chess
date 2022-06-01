const express = require("express");
const UUID = require("uuid");
const app = express();
const server = require("http").createServer(app);
const port = 6060;

const games = require("./src/games.js");

const WebSocket = require("ws");
const { response } = require("express");
const wss = new WebSocket.Server({ server: server });

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

app.get("/testId/:id", function (req, res) {
  games.testId(req.params.id, (result) => {
    console.log(result);
    res.send({ result: result });
  });
});

// app.post("/api/newGame", function (req, res) {
//   games.newGame(req.body.gameId, (result) => {
//     res.send({ id: result });
//   });
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

console.log("Server running on http://localhost:" + port);
server.listen(port);
