import { useState } from "react"
import axios from "axios"
import {Link,useNavigate} from "react-router-dom"
const Register = ()=>{
    const navigate = useNavigate()
    const [formData,setFormData]=useState({
        name:"",email:"",password:""
    })
    const [showPassword,setShowPassword]=useState(false)
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
                    <div className="mb-3 position-relative">
                        <input type={showPassword ? "text" : "password"} className="form-control pe-5" placeholder="Enter Your Password" name="password" value={formData.password} onChange={handleChange} required/>
                        <i 
                            className={`bi ${showPassword ? "bi-eye-slash":"bi-eye"}`}
                            onClick={()=>setShowPassword(!showPassword)}
                            style={{position:"absolute",right:"15px",top:"50%",transform:"translateY(-50%)",cursor:"pointer",fontSize:"1.2rem"}}
                        >
                        </i>
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