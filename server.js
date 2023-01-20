const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const bodyparser = require('body-parser')
const session = require('express-session')
const {v4:uuidv4} = require('uuid')
const router = require("./router")
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

// const path = require("path");


var listofrooms = []

const botName = 'chatbot '
app.use(express.static("public"));
app.use(express.static("public/assets"));
// app.use("/static", express.static(path.join(__dirname, "public")))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true
}))

app.use('/route', router)

app.get("/resetpassword", (req,res)=> {
  res.send("you want to reset your password huh, well unfortunately that feature hasn't been programmed yet")
})

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/home.html');
  res.render('base', {title:'login system'})
});

app.get('/joinroom', (req, res) => {
  // res.sendFile(__dirname + '/home.html');
  res.render('chat', {title:'login system'})
});

app.get("/pickcodename", (req,res)=> {
  if(req.session.user) {
      res.render('selectuser')
  } else {
      res.send("Unathorized User")
  }
});

app.post('/joinroom', (req, res, next)=> {
  console.log(req.body.name)
  res.send("you want to reset your password huh, well unfortunately that feature hasn't been programmed yet")
})
//run when a client connects
io.on('connection', (socket) => {

  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room)
    console.log(socket.id)
    console.log(username)
    console.log(room)
    console.log(user.room)
    socket.join(user.room);

    socket.emit('message', formatMessage(botName,'Welcome to ChatRoom'));
 
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${username} has joined the chat`));

    //send users and room info
    io.to(user.room).emit('roomUsers', {room:user.room, users:getRoomUsers(user.room)})
  });

  console.log("New websocket connection with the id: ", socket.id);

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  //Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
      io.to(user.room).emit('roomUsers', {room:user.room, users:getRoomUsers(user.room)})              
    }
    
  });

  //Listen for chatMessage
  socket.on('chatMessage', (msg)=>{
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message',formatMessage(user.username, msg));
  })

});




server.listen(3002, () => {
  console.log('listening on  port number 3002');
});