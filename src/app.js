import express from 'express';
import { Server } from 'socket.io';
import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

const server = app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

const io = new Server(server);
const messages = [];

io.on('connection', socket => {

    socket.on('login', data => {
        io.emit('chat', getMessages());
    });

    socket.on('message', data => {
        messages.push(new Message(data.user, data.text));
        io.emit('chat', getMessages());
    });

});

const getMessages = () => {
    return messages.map(message => {
        return {
            user: message.user,
            text: message.text,
            time: message.getMinutes()
        };
    });
}

class Message {
    constructor(user, text) {
        this.user = user;
        this.text = text;
        this.time = new Date();
    }

    getMinutes() {
        return Math.floor((new Date() - this.time) / 60000);
    }

}