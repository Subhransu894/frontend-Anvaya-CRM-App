import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
export default function Setting(){
    const [leads,setLeads]=useState([])
    const [agents,setAgents]=useState([])
    const navigate = useNavigate()
    const hasShownToast = useRef(false)

    const fetchLead=async()=>{
        try {
            const res = await fetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/leads")
            if(!res.ok) throw new Error("Failed to fetch leads") 
            const data =await res.json()
            console.log("Agents Response: ",data);
            setLeads(data.lead || [])
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    };
    const fetchAgent= async()=>{
        try {
            const res =await fetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/sales-agents")
            if(!res.ok) throw new Error("Failed to fetch agents") 
            const data =await res.json()
            setAgents(data.agent || [])
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    useEffect(()=>{
        const loadData = async()=>{
            const leadSuccess = await fetchLead()
            const agentSuccess = await fetchAgent()
            if(!hasShownToast.current){
                if(leadSuccess && agentSuccess){
                    toast.success("Leads and agents data load successfully")
                }else{
                    toast.error("Failed to loaded some data")
                }
                hasShownToast.current = true
            }
        } 
        loadData()
    },[])

    const deleteLead = async(id)=>{
        try{
           const res= await fetch(`https://backend-anvaya-crm-app-w3ca.vercel.app/api/leads/${id}`,{method:"DELETE"})
           const data = await res.json()
           if(res.ok){
                fetchLead()
                toast.success("Lead deleted successfully")
           }else{
                toast.error(data.message || "Failed to delete lead")
           }
           
        }catch(error){
            console.log(error)
            toast.error("Something went wrong while deleting lead")
        }
    }
    const deleteAgent = async(id)=>{
        try {
            const res=await fetch(`https://backend-anvaya-crm-app-w3ca.vercel.app/api/sales-agents/${id}`,{method:"DELETE"})
            const data = await res.json()
            if(res.ok){
                fetchAgent()
                toast.success("Agent deleted successfully")
            }else{
                toast.error(data.message || "Failed to delete agent")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while deleting agent")
        }
    }
    return(
        <div>
           <nav className="bg-light d-flex justify-content-center align-items-center p-4">
                <h2 style={{margin:0}}>Settings</h2>
           </nav>
            <div className="container mt-4 px-2 px-sm-3">
                <h4 className="text-center mb-2">All Leads</h4>
                <div className="table-responsive p-2 p-sm-3">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Source</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead)=>(
                                <tr key={lead._id}> 
                                    <td>{lead.name}</td>
                                    <td>{lead.source}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={()=>deleteLead(lead._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                

                {/* Agent section */}
                <h4 className="text-center mb-2 mt-2">All Sale Agents</h4>
                <div className="table-responsive p-2 p-sm-3">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map((ag)=>(
                                <tr key={ag._id}>
                                    <td>{ag.name}</td>
                                    <td>{ag.email}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={()=>deleteAgent(ag._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-center mt-3">
                <button className="btn btn-primary btn-sm"  onClick={()=>navigate("/")}>Back To Home</button>
            </div>
        </div>
    )
}