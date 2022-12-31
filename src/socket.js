module.exports = (io)=>{
    //Escribimos una funcion donde guardamos los dibujos
    let data = []
    let users = 0
    //Mediante io detectar un evento tipo connection, es decir que me detecte una nueva conexion de un usuario
    io.on('connection', (socket)=>{
        //Lo envio a cualquier usuario que acceda cuando se detecta una conexion.
        for (let i = 0; i < data.length; i++) {
            //Cada elemento del arreglo lo envio a todos los usuarios
            io.emit('show_drawing', data[i])                
        }

        users += 1
        io.emit('users', users)

        socket.on('delete', ()=>{
            //Vaciamos el arreglo
            data = []
            //LLamamos al metodo show_drawing(null)
            io.emit('show_drawing', null)
        })

        //Genera los datos del usaurio con el socket luego con on escucho el evento que me esta generando y el nombre del evento es drawing
        //luego en la funcion recibo los datos que me envia que son los datos del dibujo
        socket.on('drawing', (drawing)=>{
            //Guardo el dibujo
            data.push(drawing)

            //io voy a emitir un nuevo evento llamado show_drawing y le envio este valor que me esta llegando el mismo valor le paso drawing
            io.emit('show_drawing', drawing)
        })

        socket.on('disconnect',()=>{
            users-=1
            io.emit('users', users)
        })

    })
}
