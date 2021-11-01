const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors');
const e = require('express');
const io = require('socket.io')(server,{
    cors : {
        origin :"*",
        credentials :true
    }
});

let roomList = []


io.on('connection', (socket) => {
    socket.on('join',({username, room}) =>{
        socket.join(room)
        console.log(username, '가' , room, '번 방에 입장하셨습니다')
        enterRoom(username,room)
        console.log(roomList)
        io.to(room).emit('joinRoom',{username,room})
    })

    socket.on('leave',({username, room}) =>{
        socket.leave(room)
        console.log(username, '가' , room, '번 방에서 퇴장하셨습니다.')
        exitRoom(username,room)
        console.log(roomList)
        io.to(room).emit('leaveRoom',{username,room})
    })
    
    socket.on('message',({username,room,message}) => {
        console.log(username, ':' , message)
        io.to(room).emit('message',({username, message}))
    })

    socket.on('gameMessage',({username,room,message, dap}) => {
        let counts = 0
        let countb = 0
        setTimeout(() =>{
            for(let i=0;i<dap.length;i++){
                if(dap[i] == message[i]){
                    counts = counts + 1
                }else if(message.includes(dap[i])){
                    countb = countb + 1
                }
            }
            io.to(room).emit('gameMessage',`${counts}S${countb}B`)
        },100)
    })
    
})

const enterRoom = (username,room) =>{
    let roomInfo = roomList.find(element => element.room == room)
    if( roomInfo == undefined){
        roomList.push({'room': room, 'users' : [username]})
    }else if(roomInfo.users.includes(username) === false){
        roomInfo.users.push(username)
    }
}

const exitRoom = (username,room) =>{
    let userInfo = roomList.find(element => element.room == room).users
    for(let i = 0; i< userInfo.length; i++){
        if(userInfo[i] === username){
            userInfo.splice(i,1);
            i--;
        }
    }
}

server.listen(4000, function(){
    console.log('listening on port 4000');
})