import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { toast } from "react-toastify"
export default function NewAgentForm(){
    const navigate = useNavigate()
    // const{data,loading,error}=useFetch("http://localhost:3000/api/sales-agents")
    const [email,setEmail]=useState("")
    const [name,setName]=useState("")
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("");

    useEffect(()=>{
        toast.info("New agent form successfully loaded")
    },[])

    const handleCreate=async()=>{
        if(!name && !email){
            setError("Both fields are required");
            return;
        }
        setLoading(true)
        setError("")
        try {
            const res = await fetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/sales-agents",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({name,email})
            })
            const data = await res.json()
            if(!res.ok){
                setError(data.message || "Failed to create agent")
                setLoading(false)
                return
            }
            toast.success("Agent added successfully")
            navigate("/salesList")
        } catch (error) {
            setError("something wait wrong")
        }
        setLoading(false)
    }
    return(
        <div>
            <nav className="navbar navbar-light bg-light px-4" style={{height:"60px"}}>
                <div className="container d-flex justify-content-center">
                     <h3 className="mb-0">Add New Sales Agent</h3>
                </div>
            </nav>
               <div className="d-flex " style={{minHeight:"100vh"}}>
                    {/* left-side bar */}
                    <div className="bg-light border-end" style={{width:"220px", padding:"20px"}}>
                        <button className="btn btn-secondary w-100" onClick={()=>navigate("/")}>Back to Home</button>
                    </div>
                    {/* rifht-side bar */}
                    <div className="flex-grow-1 d-flex flex-column  align-items-center">
                        <h3 className="mb-4 mt-4 text-center">Create New Agent</h3>
                        <div className="w-75 bg-light p-4" style={{maxWidth:"600px",borderRadius:"8px",}}> 
                             <div className="mb-3">
                                <label className="form-label">Agent Name:</label>
                                <input type="text" className="form-control" placeholder="Enter agent name" 
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email Address:</label>
                                <input type="text"className="form-control" placeholder="Ennter Email Address"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)} 
                                />
                            </div>
                            
                            <button className="btn btn-primary w-100" onClick={handleCreate}>
                                {loading ? "Creating..." : "Create Agent"}
                            </button>
                        </div>  
                    </div>
                </div>
        </div>
    )
}