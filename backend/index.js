const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{ cors:{origin:"*"} });


server.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

io.on("connection",(socket)=>{
    console.log("A user Connected with id : ",socket.id);

    socket.on("joinRoom",({room,user})=>{
        socket.join(room);
        socket.user = user + socket.id.slice(0,5);
        console.log(`Use ${socket.id} Joined The room ${room}`)
    })

    socket.on("message",({room,msg})=>{
        io.to(room).emit("message",{
            sender:socket.user,
            msg
        });
    })

    socket.on("typing",({room,user})=>{
        socket.to(room).emit("typing",user);
    })

    socket.on("disconnected",()=>{
        console.log(" User Disconnected with id : ",socket.id);
    })
})