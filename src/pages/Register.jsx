import { useState } from "react"
import axios from "axios"
import {Link,useNavigate} from "react-router-dom"
const Register = ()=>{
    const navigate = useNavigate()
    const [formData,setFormData]=useState({
        name:"",email:"",password:""
    })
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const handleForm= async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post("https://backend-anvaya-crm-app-w3ca.vercel.app/api/auth/register",formData)
            alert(response.data.message)
            setFormData({
                name:"",email:"",password:"",
            })
            navigate("/login")
        } catch (error) {
            alert(
                error.response?.data?.message || "Registration Failed"
            )
        }
    }
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{width:"400px"}}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleForm}>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Enter Your Name" name="name" value={formData.name} onChange={handleChange} required/>
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Enter Your Email" name="email" value={formData.email} onChange={handleChange} required/>
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" placeholder="Enter Your Password" name="password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
                <p className="mt-3 text-center">
                    Already Registered ? <Link to='/login'>Login</Link>
                </p>
            </div>
        </div>
    )
}
export default Register