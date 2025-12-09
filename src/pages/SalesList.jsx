import { useFetch } from "../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { useRef } from "react"
export default function SalesList(){
    const {data,loading,error}=useFetch("http://localhost:3000/api/sales-agents")
    const navigate = useNavigate()
    const hasShownToast = useRef(false)

    useEffect(()=>{
        if(!loading){
            if(error && !hasShownToast.current){
                toast.error("Failed to load agents")
                hasShownToast.current = true;
            }
            else if(!error && data?.agent && !hasShownToast.current){
                toast.success("Agent loaded successfully")
                hasShownToast.current = true
            }
        }
    },[loading,data,error])
    
    return(
        <div>
            <nav className="navbar navbar-light bg-light ">
                <div className="container d-flex justify-content-center ">
                    <h3 className="mb-3">Sales Management</h3>
                </div>
            </nav>
            <div className="d-flex" style={{minHeight:"100vh"}}>
                {/* left-side bar */}
                <div className="bg-light border-end p-4" style={{width:"220px"}}>
                    <button className="btn btn-secondary w-100" onClick={()=>navigate("/")}>Back to Home</button>
                </div>
                {/* right-side bar */}
                <div className="flex-grow-1  p-4 d-flex flex-column align-items-center">
                    <h3 className="mb-4 tex-center">Sales Agent Lists</h3>
                    <div className="w-100 w-md-75 p-4 border-rounded  bg-light" style={{maxWidth:"600px"}}>
                        {loading && <p className="text-center">Loading...</p> }
                        {error && <p className="text-center">{error}</p> }

                        {/* show agent */}
                        {data?.agent?.length > 0 ? (
                            data.agent.map((ag,idx)=>(
                                <p key={ag._id} className="fs-5 text-center my-3">
                                    <strong>Agent {idx+1}: </strong>
                                    {ag.name} - {ag.email}
                                </p>
                            ))
                        ) :(
                            !loading && <p className="text-center">No agents found</p>
                        ) }
                        <div className="text-center mt-4" onClick={()=>navigate("/agentForm")}>
                            <button className="btn btn-primary mt-3">Add New Agent</button>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}