import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { Link, useSearchParams } from 'react-router-dom'

const ResetPasswordPage = () => {
  const { resetPassword } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!password || password !== confirmPassword) return
    setLoading(true)
    await resetPassword(token, password)
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-white'>
        <div className='flex items-center gap-3 mb-4'>
          <img src={assets.lock_icon || assets.logo_icon} alt="reset" className='w-8 h-8'/>
          <h1 className='text-2xl font-semibold'>Reset Password</h1>
        </div>
        <p className='text-gray-300 text-sm mb-6'>Choose a strong new password.</p>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>          <input value={password} onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='New password' required className='p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400'/>
          <input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type='password' placeholder='Confirm password' required className='p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400'/>
          <button disabled={loading} type='submit' className='py-3 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition disabled:opacity-60'>
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <div className='mt-6 text-sm text-gray-300'>
          <Link to='/login' className='text-blue-300 hover:text-blue-200'>Back to login</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage


