import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === 'Sign up') {
      if(!isDataSubmitted){
        setIsDataSubmitted(true);
        return;
      }
      if(!fullName || !email || !password || !bio) {
        toast.error("All fields are required");
        return;
      }
      login('signup', {fullName, email, password, bio});
    } else {
      if(!email || !password) {
        toast.error("Email and password are required");
        return;
      }
      login('login', {email, password});
    }
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <div className="text-center">
        <img src={assets.logo_big} alt="Intext" className="w-48 h-auto mb-4" />
        <p className="text-gray-300 text-xl">Connect and chat seamlessly</p>
      </div>

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/10 text-white border-white/20 p-6 flex flex-col gap-6 rounded-2xl shadow-2xl backdrop-blur-xl'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>
          }
          
         </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
           type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder="Full Name" required/>
        )}

        {!isDataSubmitted && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
           type="email" placeholder='Email Address' required className='p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'/>
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
           type="password" placeholder='Password' required className='p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'/>
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
             rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...' required></textarea>
          )
        }        <button type='submit' className='py-3 bg-gradient-to-r from-green-500 to-cyan-600 text-white rounded-md cursor-pointer hover:from-green-400 hover:to-cyan-500 transition'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-blue-500 cursor-pointer hover:text-blue-400'>Login here</span></p>
          ) : (
            <>
              <p className='text-sm text-gray-600'>Create an account <span onClick={()=> setCurrState("Sign up")} className='font-medium text-cyan-500 cursor-pointer'>Click here</span></p>
              <p className='text-sm text-gray-600'>Forgot password? <Link to='/forgot-password' className='font-medium text-cyan-400 hover:text-cyan-300'>Reset here</Link></p>
            </>
          )}
        </div>
         
      </form>
    </div>
  )
}

export default LoginPage
