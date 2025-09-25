import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const { authUser } = useContext(AuthContext)
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Static background (no animations) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#042f2e] via-[#0f172a] to-[#0c4a6e]" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">
        <Toaster/>
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
          <Route path='/forgot-password' element={!authUser ? <ForgotPasswordPage /> : <Navigate to='/' /> }/>
          <Route path='/reset-password' element={!authUser ? <ResetPasswordPage /> : <Navigate to='/' /> }/>
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
