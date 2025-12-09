import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
import{ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/leadForm' element={<LeadForm/>} />
          <Route path='/leadList' element={<LeadList/>}/>
          <Route path='/leads/:id' element={<LeadDetails/>} />
          <Route path='/salesList' element={<SalesList/>}/>
          <Route path='/agentForm' element={<NewAgentForm/>}/>
          <Route path='/report' element={<Report/>}/>
          <Route path='/setting' element={<Setting />}/>
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
