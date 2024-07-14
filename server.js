// Node Server
const http = require("http");
const express = require("express");

const app = express();
app.use('/css', express.static('css'));

const server = http.createServer(app);
const port = process.env.PORT || 6118;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// socket io set up 
const io = require("socket.io")(server);
var users = {};

io.on("connection", (socket) => {
    socket.on("new-user-joined", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit("user-join", username);
        io.emit('user-list',users);
    });
    
    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected',user = users[socket.id]);
        delete users[socket.id];
        io.emit('user-list',users);
        
    });

    socket.on('message-right',(data)=>{
        socket.broadcast.emit("message-right",{user: data.user, msg: data.msg});
    });
});

server.listen(port, () => {
    console.log("Server started on " + port);
});