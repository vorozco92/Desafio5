import express from "express"
import __dirname from "./utils.js"

//import viewRouter from "./routes/views.router.js"
import handlebars from "express-handlebars" 

import mongoose from "mongoose"
import { Server } from 'socket.io'

//import coursesRouter from "../src/routes/courses.router.js"
import cartsRouter from "../src/routes/carts.router.js"
import productsRouter from "../src/routes/products.router.js"
import messagesRouter from "../src/routes/messages.router.js"
import realTimeRouter from "../src/routes/realtime.route.js"

const app = express();
const PORT = 8080;


//mongoose.set('strictQuery',false)
const connection  = mongoose.connect("mongodb+srv://vorozco:7TUWS6ekWahMBYHU@ecommerce.kzv8tdc.mongodb.net/ecommerce?retryWrites=true&w=majority") 

const server = app.listen(PORT, ()=>{console.log("Server arriba")})
const io = new Server(server)

app.io = io;

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'))
app.use('/api/products', productsRouter)
app.use('/api/carts',cartsRouter);
app.use('/realtimeproducts',realTimeRouter);
app.use('/',messagesRouter);



/*io.on('connection', socket => {
    console.log("Nuevo cliente conectado")

    io.emit('messagesLogs',messages);
    socket.on('message', data => {
        messages.push(data);
        io.emit('messagesLogs',messages);
        console.log(data)
    })

    socket.on('newUser', data => {
        socket.broadcast.emit('newUserFront',data);
        console.log(data)
    })
    
})*/