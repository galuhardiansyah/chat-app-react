const Conversation = require('../models/Conversation');

const conversationController = {
  createConversation: async (req, res) => {
    try {
      const roomID = generateRandomRoomID();
      const existingConversation = await Conversation.findOne({ roomID });
      if (existingConversation) {
        return res.redirect(307, '/api/conversations/create');
      }

      const newConversation = new Conversation({ roomID });
      await newConversation.save();
      res.status(201).json({ roomID });
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ success: false, messages: 'Internal Server Error' });
    }
  },

  getConversation: async (req, res) => {
    const { roomId } = req.params;
    const { username } = req.query;

    try {
      const userInConversation = await Conversation.findOne({ roomID: roomId, users: username });

      if (userInConversation) {
        
        return res.status(403).json({ success: false, messages: 'User is already a participant in this conversation' });
      }

      await Conversation.findOneAndUpdate(
        { roomID: roomId },
        { $addToSet: { users: username } },
        { new: true }
      );

      const conversation = await Conversation.findOne({ roomID: roomId });

      if (!conversation) {   
        return res.status(404).json({ success: false, messages: 'Conversation not found' });
      }

      res.status(200).json(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      
      res.status(500).json({ success: false, messages: 'Internal Server Error' });
    }
  },

  exitConversation: async (req, res) => {
    const { roomId, username } = req.params;

    try {

      const updatedConversation = await Conversation.findOneAndUpdate(
        { roomID: roomId },
        { $pull: { users: username } },
        { new: true }
      );

      if (!updatedConversation) {
        return res.status(404).json({ success: false, messages: 'Conversation not found' });
      }

      res.status(200).send('User exited from the conversation');
    } catch (error) {
      console.error('Error exiting conversation:', error);
      res.status(500).json({ success: false, messages: 'Internal Server Error' });
    }
  },
};

const generateRandomRoomID = () => {
  const shortid = require('shortid');
  return shortid.generate();
};

module.exports = conversationController;
