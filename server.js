const express = require('express')
const http = require('http')
const path = require('path')
const mongoose = require('mongoose')
const router = require('./routers/index')
const messageServices = require('./services/MessageServices')
const cors = require('cors')
const socket = require('socket.io')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socket(server,{
    cors: {
        origin: "https://anhtuanpham1507.github.io",
        methods: ["GET", "POST"],
        credentials: true
      }
})

mongoose.connect(
     "mongodb+srv://1851050171tuan:0943722631aA@cluster0.byptz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser:true}
)
const db = mongoose.connection
db.on("err",console.error.bind(console,"connection error : "))
db.once("open",()=>{
    console.log("connected to MongoDB")
})

io.on
("connection",socket=>{
    
    socket.onclose = function(reason){
        this.emit('disconnecting', reason)
        Object.getPrototypeOf(this).onclose.call(this, reason);
    }

    socket.on('new_connection' , arrChatBox => {
        try{
            let arr = []
            arrChatBox.forEach(chatBox =>{
                if(socket.adapter.rooms.has(chatBox._id))
                {
                    arr.push(chatBox._id)
                    socket.broadcast.to(chatBox._id).emit('new_connection-user',[chatBox._id])
                }
                socket.join(chatBox._id)
            })
            socket.emit('new_connection-user',arr)
        }
        catch(err){console.log(err)}
    })

    socket.on('chat_message', ({account,chatBoxID,message,time}) => {
        messageServices.create({content:message,type:"text",chatBox_ID :chatBoxID, acc_ID:account._id, createdAt:time})
                        .then(data =>{
                            socket.broadcast.to(chatBoxID).emit('chat_message-user',({message,time,avatar:account.avatar}))  
                        })
                        .catch(err=>{
                            console.log(err)
                        })
    })

    socket.on('image_upload',({avatar,chatBoxID,image,time})=>{
        socket.broadcast.to(chatBoxID).emit('image_upload-user',({image,time,avatar}))
    })

    socket.on('disconnecting', function(reason){
        socket.adapter.rooms.forEach((value,key)=>{
            if(value.size == 2)
                if(socket.adapter.rooms.get(key).has(socket.id))
                    socket.broadcast.to(key).emit('disconnecting-user',key)
        })
    })
    // signaling
    socket.on('offerVideoChat',({chatBoxID,name,roomId}) => {
        socket.broadcast.to(chatBoxID).emit('offerVideoChat-user',{name,roomId})
    })

    socket.on('joinRoom',({roomId,iD})=>{
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('joinRoom-user',iD)  
     
      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('v_disconnect-user', iD)
      })
    })
    socket.on('refuse',({roomId,name})=>{
        socket.broadcast.to(roomId).emit('refuse-user',name)
    })

})

app.use(cors({
    origin:"https://anhtuanpham1507.github.io",
    methods: ["GET","HEAD","PUT","PATCH","POST","DELETE","OPTIONS"],
    preflightContinue:false,
    optionSuccessStatus:204,
    credentials: true
}))
app.use(express.static(path.join(__dirname,"static")))
app.use(express.json());
app.use('/api',router)



server.listen(port,()=>{
    console.log(port)
})