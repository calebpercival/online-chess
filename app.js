const express = require('express')
const UUID = require('uuid')
const app = express()
const server = require('http').createServer(app)
const port = 6060

const WebSocket = require('ws')
const wss = new WebSocket.Server({ server:server })

wss.on('connection', function connection(ws) {
    console.log('new client connected')
    ws.send('welcome new client')

    ws.on('message', function incoming(data){
        console.log('recieved: %s', data)
        wss.clients.forEach(function each(client) {
            if(client.readyState === WebSocket.OPEN){
                client.send(data)
            }
        })
    })
})

//serve html, js, css from public folder
app.use(express.static('public'))
app.use(express.json())

console.log("Server running on http://localhost:" + port)
server.listen(port)


