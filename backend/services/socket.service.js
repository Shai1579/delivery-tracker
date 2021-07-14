const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}

function emit({ type, data }) {
    gIo.emit(type, data);
}


function connectSockets(http, session) {
    gIo = require('socket.io')(http);

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));
    gIo.on('connection', socket => {

        console.log('connection!')
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket

        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            gSocketBySessionIdMap[socket.handshake?.sessionID] = null
        })

        socket.on('register deliverer', ids => {
            console.log('registering deliverer with:', ids);
            socket.ordersIds = ids
        })

        socket.on('register customer', id => {
            if (socket.orderId) socket.leave(id)
            console.log('registering costumer with:', id);
            socket.orderId = id
            socket.join(id)
        })

    })
}


function getSocket() {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('shouldn\'t happen, no sessionId in asyncLocalStorage store')
    const socket = gSocketBySessionIdMap[sessionId]
    if (!socket) return logger.debug('Shouldn\'t happen, No socket in map')
    return socket
}

// Send to all sockets BUT not the current socket 
function broadcast(type, data, sendTo = null) {
    try {
        const excludedSocket = getSocket()
        if (sendTo) {
            excludedSocket.to(sendTo).emit(type, data)
        }
        else excludedSocket.broadcast.emit(type, data)
    } catch (err) {
        logger.debug('failed to emit socket event')
    }
}

module.exports = {
    connectSockets,
    emit,
    broadcast,
    getSocket
}



