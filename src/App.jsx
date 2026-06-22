import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Navigate} from "react-router-dom"
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
// import './App.css'
import Home from './pages/Home'
import LeadForm from './pages/LeadForm'
import LeadList from './pages/LeadList'
import LeadDetails from './pages/LeadDetails'
import SalesList from './pages/SalesList'
import NewAgentForm from './pages/NewAgentForm'
import Report from './pages/Report'
import Setting from './pages/Setting'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import{ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={localStorage.getItem("token")?<Navigate to='/home'/> : <Navigate to='/login' />} />
          {/* Publiv route */}
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>

          <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path='/leadForm' element={<ProtectedRoute><LeadForm/></ProtectedRoute>} />
          <Route path='/leadList' element={<ProtectedRoute><LeadList/></ProtectedRoute>}/>
          <Route path='/leads/:id' element={<ProtectedRoute><LeadDetails/></ProtectedRoute>} />
          <Route path='/salesList' element={<ProtectedRoute><SalesList/></ProtectedRoute>}/>
          <Route path='/agentForm' element={<ProtectedRoute><NewAgentForm/></ProtectedRoute>}/>
          <Route path='/report' element={<ProtectedRoute><Report/></ProtectedRoute>}/>
          <Route path='/setting' element={<ProtectedRoute><Setting/></ProtectedRoute>}/>
        </Routes>
      </Router>
      <ToastContainer 
        position='top-center'
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme='colored'
      />
    </>
  )
}

export default App
