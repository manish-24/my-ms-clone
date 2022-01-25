const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const { v4: uuidV4 } = require('uuid')


const io = require("socket.io")(server, {
    cors:{
        origin: '*',
        methods: ["GET", 'POST']
    }
})

app.use(cors())

const users = {};
var roomid;

const socketToRoom = {};

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     res.send('running')
// })

// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
//   })

// app.get('/:room', (req, res) => {
//     // res.render('room', { roomId: req.params.room })
    

// })
// console.log('users',users)


io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        roomid = roomID
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });
    socket.on('message', (message) => {
        //send message to the same room
        io.to(message.id).emit('createMessage', message.message)
        // console.log(id)
        // console.log(message.id)
    }); 

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

// console.log('users',users)


// io.on('connection', (socket) =>{
//     socket.emit('me', socket.id)

//     socket.on('disconnect', () => {
//         socket.broadcast.emit('callended')
//     })

//     socket.on('calluser', ({ userToCall, signalData, from, name}) =>{
//         io.to(userToCall).emit('calluser', {signal: signalData, from, name})

//     })

//     socket.on('answercall', (data) => {
//         io.to(data.to).emit('callAccepted', data.signal)
//     })

// })

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));