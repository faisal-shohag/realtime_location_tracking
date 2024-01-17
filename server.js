const express = require('express')
const app = express();
const server = require('http').createServer(app);
const socketio = require('socket.io')
const io = socketio(server)
const cors = require('cors')

app.use(express.static(__dirname + "/public"));
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("A User connected! user id: "+socket.id)

    socket.on('client-location', (data)=>{
        console.log(data);
        io.emit('server-location', {...data, id: socket.id});
    })


    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        io.emit('disconnected_user', {id: socket.id})
      });

})



server.listen(3000, () => {
    console.log("Server is running on port 3000!")
})