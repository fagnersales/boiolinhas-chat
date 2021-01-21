
const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname)))

// Run when client connects
io.on('connection', socket => {
  socket.emit('newConnection', `Welcome to Boiolinhas!`)
  // Broadcast when a user connects
  socket.broadcast.emit('newConnection', `A user connected the Boiolinhas!`)
  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('newConnection', `A user left the Boiolinhas :(`)
  })

  socket.on('newAudio', ({ chunks, name }) => {
    io.emit('newAudio', { chunks, name })
  })

  socket.on('message', messageContent => {
    io.emit('message', messageContent)
  })
})

const PORT = process.env.PORT || 3333

server.listen(PORT, () => console.log('Server listening to the PORT ' + PORT))