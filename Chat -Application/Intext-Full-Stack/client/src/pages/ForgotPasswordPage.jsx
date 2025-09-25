import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const { forgotPassword } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await forgotPassword(email)
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-white'>
        <div className='flex items-center gap-3 mb-4'>
          <img src={assets.help_icon} alt="help" className='w-8 h-8'/>
          <h1 className='text-2xl font-semibold'>Forgot Password</h1>
        </div>
        <p className='text-gray-300 text-sm mb-6'>Enter your email and we'll send a reset link.</p>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Email address' required className='p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400'/>
          <button disabled={loading} type='submit' className='py-3 rounded-md bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition disabled:opacity-60'>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <div className='mt-6 text-sm text-gray-300'>
          <Link to='/login' className='text-blue-300 hover:text-blue-200'>Back to login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage


