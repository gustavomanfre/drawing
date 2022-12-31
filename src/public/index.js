// io() sirve para tener acceso a la funcionalidades del socket desde el cliente
const socket = io()
//Para indicar si se da click en la pantalla
let click = false
// Controlar el movimiento en pantalla
let moving_mouse = false
//Indicar la posicion en x del mouse.
let x_position = 0
//Indicar la posicion en y del mouse.
let y_position = 0
//Para dibujar en canvas necesitamos una posicion previa de x e y, luego cambiamos {x_position:0, y_position:0} por null
let previous_position = null
//Indicar el color inicial
let color = "black"

//constante users igual al elemento html
const users = document.getElementById('users')
//Accedemos al canvas de nuestro html.
const canvas = document.getElementById('canvas')
//Indicamos el contexto donde vamos a trabajar.
const context = canvas.getContext('2d')

//Constante que almacena ancho del navegador.
const width = window.innerWidth
//Constante que almacena ancho del navegador.
const height = window.innerHeight

//Asignamos el alto y ancho a canvas.
canvas.width = width
canvas.height = height

//Agregamos escuchador de eventos de click a canvas.
canvas.addEventListener('mousedown', ()=>{
    click = true
})

//Agregamos escuchador de eventos cuando soltamos click.
canvas.addEventListener('mouseup', ()=>{
    click = false
})

//Escuchador de eventos de movimiento del mouse, recibimos los datos en el e.
canvas.addEventListener('mousemove', (e)=>{
    x_position = e.clientX
    y_position = e.clientY
    moving_mouse = true
})

//Cambiar al color que recibe c.
function change_color(c){
    //Asignamos el color de la linea, con el color  que pasamos
    color = c
    context.strokeStyle = color
    //Luego indicamos el trazo
    context.stroke()
}

function delete_all() {
    //Vamos a emitir un evento hacia el servidor usando los socket.
    //Ponemos el nombre del evento sin parametros.
    socket.emit('delete')
}

//Creamos funcion para dibujar.
function create_drawing(){
    //Click: es igual true y moving_mouse: es igual a true ademas comprobamos la posicion previa.
    if (click && moving_mouse && previous_position != null) {
        let drawing = {
            x_position: x_position,
            y_position: y_position,
            //Inicializado en negro luego puede cambiar.
            color: color,
            //Asignamos pocisio anterior, que sera igual al objeto de abajo
            previous_position: previous_position
        }
        //Una vez creado el objeto del dibujo lo pasamos a una funcion show_drawing.
        //show_drawing(drawing)
        //Remplazamos la linea de socket por la emision de evento,con esto emito el evento y le paso el objeto.
        socket.emit('drawing', drawing)
    }
    //Sino dibujo aun creo una posicion previa. Esta sera mi posicion inicial.
    previous_position = {x_position:x_position, y_position:y_position}
   
    //Ahora creamos la funcion create_Drawing queremos que se ejecute cada cierto tiempo.
    setTimeout(create_drawing, 25)
}

//Ponemos escucha a un evento el de socket y recibimos los dato que nos envia y el contenido de la funcion lo ponemos adnetro
socket.on('show_drawing', (drawing)=>{
    if (drawing != null) {
        //Para empezar a dibujar escribimos context.beginPath y empezamos a dibujar el trazo con los datos del objeto que le pasamos drawing
        context.beginPath()

        //Asignamos el grosor de la linea
        context.lineWidth = 3
       
        //Asignamos el color de la linea, con el color del objeto que pasamos
        context.strokeStyle = drawing.color
   
        //Indicamos donde va finalizar nuestra linea y lo obtenemos de drawing.
        context.moveTo(drawing.x_position, drawing.y_position)
   
        //Indicamos desde donde empezamos a dibujar.
        context.lineTo(drawing.previous_position.x_position, 
        drawing.previous_position.y_position )
   
        //Luego indicamos el trazo
        context.stroke()

    } else {
        //Limpiamos toda la pizarra, pasamos 0,0,ancho,alto de pizarra.
        context.clearRect(0, 0, canvas.width, canvas.height)
    }
})

socket.on('users',(number)=>{
    users.innerHTML = `Numero de usuarios conectados: ${number}`
})
create_drawing()







