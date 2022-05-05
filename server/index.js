const express=require('express');
const cors=require ('cors');
const mongoose=require('mongoose')
const userRoutes=require('./routes/userRoutes')
const messagesRoute=require('./routes/messagesRoute')
const app=express();
const socket=require ('socket.io');
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.use('/api/auth',userRoutes)
app.use('/api/messages',messagesRoute)

//database 
main().catch(err => console.log(err));

async function main() {
    console.log('database connected');
  await mongoose.connect(process.env.MONGO_URL);
}

const server=app.listen(process.env.PORT,()=>{
    console.log(`server started on port ${process.env.PORT}`)
})

const io=socket(server,{
  cors:{
    origin:'http://localhost:3000',
    credentials: true,
  }
});
global.onlineUsers=new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});

