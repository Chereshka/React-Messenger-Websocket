let wss;


const setWss = (wsServer) => {
    wss = wsServer;
}

/**
 * Отправляет сообщение всем подключенным клиентам через WebSocket.
 *
 * @param {Object} message - Сообщение для отправки.
 * @param {WebSocket.Server} wss - WebSocket сервер.
 */
const sendMessage = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = { sendMessage, setWss };
