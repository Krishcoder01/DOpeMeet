const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
import('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('signalinMessage', (message) => {
        
        socket.broadcast.emit('signalinMessage', message);
    })
    
})

app.get('/', (req, res) => {
    res.render('stream');
})

server.listen(process.env.PORT);
