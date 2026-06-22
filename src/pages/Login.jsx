import { useState } from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom"
const Login =()=>{
    const navigate = useNavigate()
    const [formData,setFormData]=useState({
        email:"",password:"",
    })
    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post("https://backend-anvaya-crm-app-w3ca.vercel.app/api/auth/login",formData)
            localStorage.setItem("token",response.data.token)
            alert("Login Successful")
            navigate("/home")
            console.log(response.data.token)
        } catch (error) {
            alert(
                error.response?.data?.message || "Login Failed"
            )
        }
    }
    return(
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{width:"400px"}}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="email" name="email" className="form-control" placeholder="Enter Email" value={formData.email} onChange={handleChange} required/>
                    </div>
                    <div className="mb-3">
                        <input type="password" name="password" className="form-control" placeholder="Enter Password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <button className="btn btn-primary w-100" type="submit">Login</button>
                </form>
                <p className="mt-3 text-center">
                    NewUser ? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}
export default Login