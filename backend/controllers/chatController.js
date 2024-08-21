// const ChatModel = require('../models/chatModel');

// // Save chat message and emit it via Socket.IO
// exports.saveChat = async (req, res) => {
//     try {
//         const { sender_id, receiver_id, message } = req.body;

//         // Create and save the new chat message
//         const newChat = new ChatModel({
//             sender_id,
//             receiver_id,
//             message,
//         });
//         const savedChat = await newChat.save();

//         // Emit the saved chat message to both sender and receiver
//         req.io.to(sender_id).emit('newChat', savedChat);
//         req.io.to(receiver_id).emit('newChat', savedChat);

//         // Respond with the saved chat
//         res.status(201).json({
//             success: true,
//             message: 'Chat message saved successfully!',
//             data: savedChat
//         });
//     } catch (error) {
//         console.error('Error saving chat message:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to save chat message',
//             error: error.message
//         });
//     }
// };

// // Retrieve chat messages between two users
// exports.getChats = async (req, res) => {
//     try {
//         const { sender_id, receiver_id } = req.params;

//         // Find chat messages between the two users
//         const chats = await ChatModel.find({
//             $or: [
//                 { sender_id: sender_id, receiver_id: receiver_id },
//                 { sender_id: receiver_id, receiver_id: sender_id }
//             ]
//         }).sort({ createdAt: 1 });

//         // Respond with the retrieved chat messages
//         res.status(200).json({
//             success: true,
//             data: chats
//         });
//     } catch (error) {
//         console.error('Error retrieving chat messages:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve chat messages',
//             error: error.message
//         });
//     }
// };
