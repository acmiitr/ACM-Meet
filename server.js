const express = require('express')
const fs = require("fs");
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const port = process.env.PORT || 30000;
app.set('view engine', 'ejs');
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true
})


app.use('/peerjs', peerServer) // the url to be used for peer server 
app.use(express.static('pub'));
//specifies the public files(accessible through browser by users) would live in the dir:pub !

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
} //unique rand url generator
let uuid = create_UUID();

app.get('/', (req, res) => {
  res.redirect(`/${uuid}`)
}) // redrirects to the url generated
app.get('/:view', (req, res) => {
  res.status(200);
  res.render('view', { viewId: req.params.view });
})

//creating the room
io.on('connection', socket => {
  socket.on('join-room', (roomid, userid) => {
    console.log("Yea you made it to the room!")
    socket.join(roomid)
    socket.to(roomid).emit('user-connected', userid);

    socket.on('message', (message,user_name) => {
      //send message to the same room
      io.to(roomid).emit('createMessage', message,user_name)
    }); 
  })
})



// we also have to listen to a server, or else the server won't run:
server.listen(port, () => {
  console.log(`Server listens on port: ${port}`);
});
