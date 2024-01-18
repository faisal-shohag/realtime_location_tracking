const express = require('express')
const app = express();
const server = require('http').createServer(app);
const socketio = require('socket.io')
const io = socketio(server)
const cors = require('cors')

app.use(express.static(__dirname + "/public"));

// Allow requests from your client server
const corsOptions = {
    origin: 'https://locationreal.onrender.com/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let current_users = {}

io.on('connection', (socket) => {
    console.log("A User connected! user id: "+socket.id)

    socket.on('client-location', (data)=>{
        current_users[socket.id] = data.username;
        io.emit('server-location', {...data, id: socket.id});
    })

    socket.on('client-join-location', (data) => {
        io.emit('client-join-server', {...data, id: socket.id})
    })


    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        io.emit('disconnected_user', {id: socket.id, username: current_users[socket.id]})
        delete current_users[socket.id]
      });

})



server.listen(3000, () => {
    console.log("Server is running on port 3000!")
})