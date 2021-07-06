const express = require('express');
const app = express();
const socketio = require('socket.io')

const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on = io.of('/').on
io.on('connection',(socket)=>{
    // console.log("Someone connected to the main namespace")
    // console.log(socket.handshake)
    const nsData = namespaces.map(ns => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })

    // console.log(nsData);
    socket.emit('nsList',nsData);
})


namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connect',(nsSocket)=>{
        const username = nsSocket.handshake.query.username;
        console.log(`${nsSocket.id} has joined to ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad',namespace.rooms)

        nsSocket.on('joinRoom',(roomToJoin,numberOfUsersCallback) => {
            // console.log(roomToJoin);
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateUserInRoom(namespace,roomToLeave);
            nsSocket.join(roomToJoin);
            
            
            const nsRoom = namespace.rooms.find(room => {
                return room.roomTitle===roomToJoin;
            })
            // console.log(roomToJoin);
            // console.log(namespace);
            nsSocket.emit('historyCatchup',nsRoom.history);

            updateUserInRoom(namespace,roomToJoin);
        })

        nsSocket.on('newMessageToServer',(msg)=>{
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'http://via.placeholder.com/30'
            }
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find(room => {
                return room.roomTitle===roomTitle;
            })
            nsRoom.addMessage(fullMsg);
            // console.log(nsRoom);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg);
        })
    })
})

function updateUserInRoom(namespace, roomToJoin){
    io.of(namespace.endpoint).in(roomToJoin).clients((error,clients)=>{
        // console.log(`There are ${clients.length} rooms`);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',clients.length);
    })
}
