const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const MessageController = require('./controllers/messages');

const { messages } = require('./controllers/messages');

const { setWss, sendMessage } = require('./utils/broadcast');


const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

setWss(wss);


wss.on('connection', ws => {
    console.log('New WebSocket connection');
    
    ws.send(JSON.stringify({ type: 'INIT', data: messages }));
    
    ws.on('message', (message) => {
        const { type, data } = JSON.parse(message, this);

        if (type === 'NEW_MESSAGE') {            
            messages.push(data);
            
            sendMessage({ type: 'UPDATE', data: messages });
        } else if (type === 'DELETE_MESSAGE') {
            messages = messages.filter(msg => msg.id !== data.id);
            
            sendMessage({ type: 'UPDATE', data: messages });
        }
    });
});

app.use('/messages', MessageController);

server.listen(port, () => {
    console.log(`Server listening on port 4000`);
});
