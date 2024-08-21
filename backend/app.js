require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const userRoute = require('./routes/userRouter');
const user = require('./models/userModel');
const Chat = require('./models/chatModel');
const cors = require('cors');

const PORT = process.env.PORT;

// Initialize express app
const app = express();
app.use(cors('*'));

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './views');


// Middleware for sessions
const session = require('express-session');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', userRoute);

// Create HTTP server and listen on the specified port
const server = http.createServer(app);
const io = require('socket.io')(server);


// Implement broadcast with Socket.IO
const userNamespace = io.of('/user-namespace');

userNamespace.on('connection', async function(socket) {
    console.log('User connected');

    const userId = socket.handshake.auth.token;

    try {
        await user.findByIdAndUpdate({_id: userId}, { $set: { is_online: '1' } });

        socket.broadcast.emit('getOnlineUser', { user_id: userId });

        socket.on('disconnect', async function() {
            console.log('User disconnected');
            await user.findByIdAndUpdate({_id: userId}, { $set: { is_online: '0' } });
            socket.broadcast.emit('getOfflineUser', { user_id: userId });
        });
    } catch (error) {
        console.error('Error updating user status:', error);
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newChat', async (data) => {
        console.log('New chat message:', data);

        // Create a new chat document
        const newChat = new Chat({
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message
        });

        try {
            // Save the chat to the database
            await newChat.save();

            // Emit the saved chat message to the other user
            socket.broadcast.emit('loadNewChat', newChat);
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');
    
        socket.on('load-chat', async function (data) {
            const chats = await Chat.find({ $or: [
                { sender_id: data.sender_id, receiver_id: data.receiver_id },
                { sender_id: data.receiver_id, receiver_id: data.sender_id }
            ]});
            
            socket.emit('loadChats', { chats: chats });
        });
    
        // Other events...
    });
    

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(PORT, function() {
    console.log(`Server listening on port ${PORT}`);
});
