const TicketControl = require("../models/ticket-control")



const ticketControl = new TicketControl()


const socketController = ( socket ) => {
        
    //Cuando un nuevo cliente se conecte 
    socket.emit('ultimo-ticket', `Ticket ${ticketControl.ultimo}`)
    socket.emit('estado-actual', ticketControl.ultimos4)
    
    socket.emit('tickets-pendientes', ticketControl.tickets.length)


    socket.on('siguiente-ticket', ( payload, callback )=>{

        const siguiente = ticketControl.siguiente()
        callback( siguiente )
        socket.broadcast.emit('ultimo-ticket', siguiente)

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)       
            
    })

    socket.on('atender-ticket', ( { escritorio }, callback )=>{
        if( !escritorio ){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.atenderTicket( escritorio )
        
        if(ticketControl.tickets.length > 0){
            //Emitir cambios en los ultimos4
            socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        }



        if( !ticket ){
            return callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            })
        }

        socket.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
        callback({
            ok: true,
            ticket
        })

    })
}

module.exports = {
    socketController
}