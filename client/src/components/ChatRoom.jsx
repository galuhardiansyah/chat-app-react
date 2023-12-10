import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const ChatRoom = ({ username }) => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageContainerRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', { roomId, username });

    return () => {
      socket.emit('leaveRoom', { roomId, username });
    };
  }, [roomId, username]);

  useEffect(() => {
    if (socket.connected) {
      const receiveMessageHandler = (message) => {
        if (message.sender !== username) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      const errorHandler = (error) => {
        console.error('Socket error:', error);
      };

      socket.on('receiveMessage', receiveMessageHandler);
      socket.on('error', errorHandler);

      return () => {
        socket.off('receiveMessage', receiveMessageHandler);
        socket.off('error', errorHandler);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/messages/${roomId}`
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        } else {
          console.error('Error fetching messages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    const message = {
      content: newMessage,
      roomId: roomId.toString(),
      sender: username,
    };
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit('sendMessage', { roomId: roomId.toString(), message });
    setNewMessage('');
  };

  return (
    <div className='max-w-[800px] mx-auto'>
      <div className='flex justify-between mt-8 mb-5'>
        <button className='text-slate-400 md:ml-0 ml-3'>Exit</button>
        <h2 className='text-center text-2xl font-bold'>{roomId}</h2>
        <p></p>
      </div>

      <div
        ref={messageContainerRef}
        className='h-[400px] md:border md:border-[#ccc] overflow-y-auto message-container p-3 rounded shadow-inner md:shadow-none'
      >
        {messages.map((message, index) => (
          <div key={index} className={`relative mx-5 md:mx-0 my-6`}>
            <div
              className={
                'w-1/2 h-5 ' +
                (message.sender !== username ? 'float-right' : 'float-left')
              }
            ></div>
            <div
              className={
                'w-1/2 mt-3 ' +
                (message.sender === username ? 'float-left' : 'float-right')
              }
            >
              {message.sender !== username && (
                <p className='text-sm mt-3'>{message.sender}</p>
              )}
              <p
                className={
                  'p-[10px] m-[5px] speech rounded-t ' +
                  (message.sender === username
                    ? 'text-right bg-[#5DB075] text-[#E8E8E8] rounded-l down-right mt-3'
                    : 'text-left bg-[#F6F6F6] text-[#262626] down-left rounded-r')
                }
              >
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className='flex relative mx-5 md:mx-0 md:my-10 my-6'>
        <input
          type='text'
          placeholder='Type your message'
          className='bg-[#f6f6f6] py-2 pl-4 pr-[4.8rem] shadow-inner border rounded-full w-full focus:outline-none'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className='absolute right-0 top-1 mr-3 rounded-full bg-[#5DB075] p-1 hover:bg-green-600'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
          >
            <rect x='0' y='0' width='24' height='24' fill='none' stroke='none' />
            <path
              fill='white'
              d='M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8v12Z'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
