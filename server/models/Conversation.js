const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  roomID: { type: String, required: true, unique: true },
  users: [{ type: String, required: true }],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
