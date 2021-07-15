const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')

const app = express()
const http = require('http').createServer(app)

const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
// Express App Config 
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session) 

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
    let corsOptions = {
        origin: ['https://maps.googleapis.com'],
        credentials: true
    }
    app.use(cors(corsOptions))
} else {
    let corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000', 'https://maps.googleapis.com'],
        credentials: true
    }
    app.use(cors(corsOptions))
} 
 
const { connectSockets, broadcast, getSocket } = require('./services/socket.service')
  
// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)
app.post('/api/coord', (req, res) => {
    if (!req.sessionID) {
        console.log('no sess id');
        return res.send() 
    }
    const {coords} = req.body
    if (!coords) return res.send()
    try {
        const socket = getSocket()
        if (!socket) return res.sendStatus(503)
        if (socket.ordersIds) {
            socket.ordersIds.forEach(id => {
                broadcast('new coords', coords, id)
            }) 
        } else {
            console.log('no ids');   
            return res.sendStatus(503)
        }
    } catch (err) {
        console.log(err);
    }



    res.send()
})
connectSockets(http, session)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3000/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})


