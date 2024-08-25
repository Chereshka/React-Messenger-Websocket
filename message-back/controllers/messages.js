const express = require('express');
const { sendMessage } = require('../utils/broadcast');


let messages = []

class MessageController {
    constructor() {
        this.router = express.Router();
        this.router.get('/', this.getMessages);
        this.router.post('/', this.createMessage);
        this.router.delete('/:id', this.deleteMessage);
    }

    
    getMessages(req, res) {
        res.json(messages);
    }

    
    createMessage(req, res) {
        const message = {
            id: Date.now().toString(),
            text: req.body.text
        };
        messages.push(message);
        sendMessage({ type: 'UPDATE', data: messages });  // Отправляем обновления через WebSocket
        res.status(201).json(message);
    }

    
    deleteMessage(req, res) {
        const { id } = req.params;
        const index = messages.findIndex(msg => msg.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Message not found' });
        }

        messages.splice(index, 1);
        sendMessage({ type: 'UPDATE', data: messages });  // Отправляем обновления через WebSocket
        res.status(204).end();
    }
}

module.exports = new MessageController().router;
