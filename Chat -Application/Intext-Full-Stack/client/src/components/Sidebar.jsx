import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

// Custom CSS classes for branding
const brandingClasses = {
  container: 'bg-[#0f172a] h-full p-5 rounded-r-xl overflow-y-scroll text-white',
  logo: 'w-40 h-auto hover:opacity-90 transition-opacity',
  searchContainer: 'bg-[#1f2937] rounded-full flex items-center gap-2 py-3 px-4 mt-5',
  searchInput: 'bg-transparent border-none outline-none text-white text-xs placeholder-gray-400 flex-1',
  userList: 'flex flex-col mt-4',
  userItem: 'relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer hover:bg-[#1f2937] transition-colors',
  userItemSelected: 'bg-[#1f2937]',
};

const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const {logout, onlineUsers} = useContext(AuthContext)

    const [input, setInput] = useState(false)

    const navigate = useNavigate();    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;
    
    useEffect(()=>{
        getUsers();
    },[onlineUsers]);

    return (
    <div className={`${brandingClasses.container} ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
            <img src={assets.logo} alt="Intext" className={brandingClasses.logo} />
            <div className="relative py-2 group">
                <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer hover:opacity-80' />
                <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#1f2937] border border-gray-700 text-gray-100 hidden group-hover:block'>                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm hover:text-blue-400 transition-colors'>Edit Profile</p>
                    <hr className="my-2 border-t border-gray-700" />
                    <p onClick={()=> logout()} className='cursor-pointer text-sm hover:text-blue-400 transition-colors'>Logout</p>
                </div>
            </div>
        </div>

        <div className={brandingClasses.searchContainer}>
            <img src={assets.search_icon} alt="Search" className='w-3 opacity-70'/>
            <input 
                onChange={(e)=>setInput(e.target.value)} 
                type="text" 
                className={brandingClasses.searchInput}
                placeholder='Search User...'
            />
        </div>

      </div>

    <div className={brandingClasses.userList}>
        {filteredUsers.map((user, index)=>(            <div 
                onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=> ({...prev, [user._id]:0}))}}
                key={index} 
                className={`${brandingClasses.userItem} ${selectedUser?._id === user._id ? brandingClasses.userItemSelected : ''}`}
            >                <img 
                    src={user?.profilePic || assets.avatar_icon} 
                    alt={user.fullName} 
                    className='w-[35px] h-[35px] rounded-full border border-gray-700 object-cover bg-gray-800'
                />
                <div className='flex flex-col leading-5'>
                    <p className="font-medium">{user.fullName}</p>
                    {
                        onlineUsers.includes(user._id)
                        ? <span className='text-emerald-400 text-xs'>Online</span>
                        : <span className='text-gray-400 text-xs'>Offline</span>
                    }
                </div>
                {unseenMessages[user._id] > 0 &&                    <div className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-gradient-to-r from-green-500 to-blue-500'>
                        {unseenMessages[user._id]}
                    </div>
                }
            </div>
        ))}
    </div>

    </div>
  )
}

export default Sidebar
