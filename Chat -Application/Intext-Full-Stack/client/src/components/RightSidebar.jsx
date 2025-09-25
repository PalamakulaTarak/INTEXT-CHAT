import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

    const {selectedUser, messages} = useContext(ChatContext)
    const {logout, onlineUsers} = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])

    // Get all the images from the messages and set them to state
    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg=>msg.image)
        )
    },[messages])
  return selectedUser && (
    <div className={`bg-[#0f172a] text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
        <div className='pt-16 flex flex-col items-center gap-4 text-sm font-light mx-auto'>
            <div className="relative">                <img 
                    src={selectedUser?.profilePic || assets.avatar_icon} 
                    alt={selectedUser.fullName}
                    className='w-24 h-24 rounded-full border-2 border-gray-700 shadow-lg object-cover bg-gray-800' 
                />
                {onlineUsers.includes(selectedUser._id) && (
                    <div className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0f172a]'></div>
                )}
            </div>
            <div className="text-center">
                <h1 className='text-2xl font-semibold mb-2'>{selectedUser.fullName}</h1>
                <p className='text-gray-400 px-8'>{selectedUser.bio}</p>
            </div>
        </div>

        <hr className="border-gray-800 my-6"/>

        <div className="px-6">
            <h3 className="text-lg font-medium mb-4">Shared Media</h3>
            <div className='grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2'>
                {msgImages.map((url, index)=>(
                    <div 
                        key={index} 
                        onClick={()=> window.open(url)} 
                        className='cursor-pointer rounded-lg overflow-hidden border border-gray-700 hover:opacity-90 transition-opacity'
                    >
                        <img src={url} alt="" className='w-full h-full object-cover'/>
                    </div>
                ))}
            </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6">
            <button 
                onClick={()=> logout()} 
                className='w-full py-3 px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full transition-colors shadow-lg'
            >
                Sign Out
            </button>
        </div>
    </div>
  )
}

export default RightSidebar
