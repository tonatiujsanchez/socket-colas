const express = require('express')
var cors = require('cors')

const { socketController } = require('../sockets/controllers')

class Server {
    constructor(){
        this.app = express()
        this.port   = process.env.PORT || 8080
        this.server = require('http').createServer(this.app)
        this.io     = require('socket.io')(this.server);

        
        // middlewares
        this.middlewares()

        // Sockets
        this.sockets()
    }

    middlewares(){
        this.app.use( cors() )

        this.app.use( express.static('public') )
    }

    sockets(){
        this.io.on("connection", socketController)
    }

    listen(){
        this.server.listen( this.port, () => {
            console.log('Corriendo en el puerto', this.port)
        })
    }

}

module.exports = Server