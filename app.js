const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

io.on('connection', (socket) => {
    socket.on('signalinMessage', (message) => {
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log('User joined room: ' + room);
        });
        socket.broadcast.emit('signalinMessage', message);
    })
    
})

app.get('/', (req, res) => {
    res.render('stream');
})

server.listen(process.env.PORT || 3000);
