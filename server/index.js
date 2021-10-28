const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server,{
    cors : {
        origin :"*",
        credentials :true
    }
});


io.on('connection', (socket) => {
    socket.on('join',({username, room}) =>{
        socket.join(room)
        console.log(username, '가' , room, '번 방에 입장하셨습니다')
        io.to(room).emit('adminMessage',{username,room})
    })

    socket.on('message',({username,room,message}) => {
        console.log(username, ':' , message)
        io.to(room).emit('message',({username, message}))
    })
    
})


server.listen(4000, function(){
    console.log('listening on port 4000');
})