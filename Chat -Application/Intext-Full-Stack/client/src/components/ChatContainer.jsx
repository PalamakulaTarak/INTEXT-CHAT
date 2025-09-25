import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, 
        getMessages} = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()
    const messagesContainerRef = useRef(null)
    // Removed shouldAutoScroll; compute near-bottom live
    const [showJumpToLatest, setShowJumpToLatest] = useState(false)
    const prevLenRef = useRef(0)
    const scrollRafRef = useRef(false)

    const [input, setInput] = useState('');

    const isNearBottom = () => {
        const el = messagesContainerRef.current
        if (!el) return true
        const threshold = 12 // smaller threshold to let users leave the bottom easily
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
        return distanceFromBottom <= threshold
    }

    const handleScroll = () => {
        if (scrollRafRef.current) return
        scrollRafRef.current = true
        requestAnimationFrame(() => {
            const near = isNearBottom()
            if (near) setShowJumpToLatest(false)
            scrollRafRef.current = false
        })
    }

    const scrollToBottom = () => {
        if (scrollEnd.current) {
            // always non-smooth to avoid snapping animations
            scrollEnd.current.scrollIntoView({ behavior: 'auto' })
        } else if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }

    // Handle sending a message
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(input.trim() === "") return null;
        await sendMessage({text: input.trim()});
        setInput("")
        // Do not auto-scroll after sending
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("select an image file")
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            toast.error("Image too large. Please select an image under 4MB.");
            e.target.value = "";
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async ()=>{
            await sendMessage({image: reader.result})
            e.target.value = ""
            // Do not auto-scroll after sending image
        }
        reader.readAsDataURL(file)
    }

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
            // Do not auto-scroll on chat switch
        }
    },[selectedUser, getMessages])

    // Respond to new messages without auto-scrolling while reading history
    useEffect(()=>{
        const grew = messages.length > prevLenRef.current
        prevLenRef.current = messages.length
        if (grew) {
            if (!isNearBottom()) {
                setShowJumpToLatest(true)
            } else {
                // If already at bottom, keep button hidden; no scroll action
                setShowJumpToLatest(false)
            }
        }
    },[messages.length])

  return selectedUser ? (    <div className='h-full overflow-hidden relative backdrop-blur-lg bg-[#0f172a]/80'>
      {/* ------- header ------- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-gray-700'>
        <img 
            src={selectedUser.profilePic || assets.avatar_icon} 
            alt="" 
            className="w-8 h-8 rounded-full border border-gray-700"
        />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
            <span className="font-medium">{selectedUser.fullName}</span>
            {onlineUsers.includes(selectedUser._id) && 
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            }
        </p>
        <img 
            onClick={()=> setSelectedUser(null)} 
            src={assets.arrow_icon} 
            alt="Back" 
            className='md:hidden w-6 h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer'
        />
        <img 
            src={assets.help_icon} 
            alt="Help" 
            className='max-md:hidden w-5 h-5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer'
        />
      </div>      {/* ------- chat area ------- */}
      <div ref={messagesContainerRef} onScroll={handleScroll} className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll overscroll-contain p-3 pb-6'>
        {messages.map((msg, index)=>(
            <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                {msg.image ? (
                    <img 
                        src={msg.image} 
                        alt="" 
                        className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 hover:opacity-95 transition-opacity cursor-pointer'
                        onClick={() => window.open(msg.image, '_blank')}
                    />
                ):(
                    <p className={`p-3 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all ${
                        msg.senderId === authUser._id 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-700/50 text-gray-100 rounded-bl-none'
                    }`}>
                        {msg.text}
                    </p>
                )}
                <div className="text-center text-xs">
                    <img 
                        src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} 
                        alt="" 
                        className='w-7 h-7 rounded-full border border-gray-700' 
                    />
                    <p className='text-gray-400'>{formatMessageTime(msg.createdAt)}</p>
                </div>
            </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Jump to latest pill */}
      {showJumpToLatest && (
        <button
          onClick={() => { setShowJumpToLatest(false); scrollToBottom() }}
          className='absolute bottom-24 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white bg-gradient-to-r from-green-500 to-blue-500 shadow hover:from-green-600 hover:to-blue-600'
        >
          New messages
        </button>
      )}

      {/* ------- bottom area ------- */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 bg-gradient-to-t from-[#0f172a] to-transparent'>
          <div className='flex-1 flex items-center bg-gray-800/50 px-4 rounded-full border border-gray-700/50'>
              <input 
                  onChange={(e)=> setInput(e.target.value)} 
                  value={input} 
                  onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} 
                  type="text" 
                  placeholder="Type your message..." 
                  className='flex-1 py-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400'
              />
              <input 
                  onChange={handleSendImage} 
                  type="file" 
                  id='image' 
                  accept='image/png, image/jpeg' 
                  hidden
              />
              <label htmlFor="image">
                  <img 
                      src={assets.gallery_icon} 
                      alt="Add image" 
                      className="w-5 mr-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                  />
              </label>
          </div>
          <button 
              onClick={handleSendMessage}
              className="p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-colors"
          >
              <img src={assets.send_button} alt="Send" className="w-5 h-5" />
          </button>
      </div>


    </div>  ) : (
    <div className='flex flex-col items-center justify-center gap-4 text-gray-400 bg-[#0f172a]/80 backdrop-blur-lg max-md:hidden h-full'>
        <img src={assets.logo_icon} className='w-20 h-20 opacity-80' alt="Intext" />
        <div className="text-center">
            <h2 className='text-2xl font-semibold text-white mb-2'>Welcome to Intext</h2>
            <p className='text-lg text-gray-400'>Start a conversation to connect with others</p>
        </div>
    </div>
  )
}

export default ChatContainer
