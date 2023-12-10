import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/conversations/${roomId}?username=${username}`);
      const data = await response.json()
      if (response.ok) {
        navigate(`/room/${roomId}?username=${username}&conversationId=${data._id}`);
      } else {
        toast.error(data.messages, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(data.messages);
      }
    } catch (error) {
      toast.error('Error fetching conversation details', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error fetching conversation details:', error);
    }
  };
  

  const handleCreateRoom = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        setGeneratedRoomId(data.roomID);
        setShowModal(true);
      } else {
        console.error('Error creating room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(generatedRoomId);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='mx-auto flex items-center justify-center h-screen'>
      <div className=' p-8 rounded md:shadow-lg md:border md:border-slate-300'>
        <h2 className='text-center text-2xl font-semibold mb-5'>Join a Chat Room</h2>
        <div className="relative mb-8 mt-12">
          <input
            id="username"
            name="username"
            type="text"
            className="peer h-10 w-full bg-[#f6f6f6] rounded text-gray-900 placeholder-transparent focus:outline-none shadow-inner px-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label
            htmlFor="username"
            className="absolute left-0 -top-6 text-[#262626] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-[#262626] peer-focus:text-sm peer-focus:left-0"
            >Username
          </label>
        </div>
        <div className="relative my-8">
          <input
            id="roomId"
            name="roomId"
            type="text"
            className="peer h-10 w-full bg-[#f6f6f6] rounded text-gray-900 placeholder-transparent focus:outline-none shadow-inner px-2"
            placeholder="Username"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <label
            htmlFor="roomId"
            className="absolute left-0 -top-6 text-[#262626] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-[#262626] peer-focus:text-sm"
            >RoomID
          </label>
        </div>
        <div className='mt-24'>
          <button onClick={handleJoinRoom} className='bg-[#5DB075] px-4 py-3 text-white w-full rounded-full hover:bg-green-600 disabled:bg-slate-300' disabled={!(username && roomId)}>Join Room</button>
          <button onClick={handleCreateRoom} className='bg-[#e8e8e8] px-4 py-3 text-[#2f2f2f] w-full mt-2 rounded-full hover:bg-[#e5e4e4]'>Create Room</button>
        </div>

        {showModal && (
          <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>     
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                  <p>Your room ID is generated: {generatedRoomId}</p>
                  <button onClick={handleCopyRoomId} className='ml-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h10Zm-4 6H5v12h10V8Zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h2Zm9-11H9v2h6a2 2 0 0 1 2 2v8h2V4Zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11h4Z"/></g></svg>
                  </button>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"onClick={handleCloseModal}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
      
  );
};

export default Home;
