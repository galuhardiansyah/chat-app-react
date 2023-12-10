const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const messageController = {

  saveMessage: async (roomId, sender, content) => {
    try {
      const conversation = await Conversation.findOne({ roomID: roomId });

      if (!conversation) {
        return { success: false, error: 'Conversation not found' };
      }

      const message = new Message({
        sender,
        content,
        conversation: conversation._id,
      });

      await message.save();
      conversation.messages.push(message._id);
      await conversation.save();

      return;
    } catch (error) {
      console.error('Error saving message:', error);
      return { success: false, error: 'Internal Server Error' };
    }
  },

  getAllMessages: async (req, res) => {
    const roomId = req.params.roomId;

    try {
      const conversation = await Conversation.findOne({ roomID: roomId }).populate('messages');
  
      if (!conversation) {
        return { success: false, error: 'Conversation not found' };
      }
      res.status(201).json({ success: true, messages: conversation.messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, messages: 'Internal Server Error' });

    }
  },
};

module.exports = messageController;
