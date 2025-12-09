import { useNavigate } from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useRef } from "react"
export default function LeadList(){
    const navigate = useNavigate()
    const {data,loading,error}=useFetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/leads")
    const leads = data?. lead || []
    const hasShownToast = useRef(false)

    const[statusFilter,setStatusFilter]=useState("");
    const[agentFilter,setAgentFilter]=useState("");
    const[sortType,setSortType]=useState("");
    const[timeSort,setTimeSort]=useState("")
    const[agents,setAgents]=useState([])

    //toast effct
    useEffect(()=>{
        if(!loading){
            if(error && !hasShownToast.current){
                toast.error("Failed to fetch lead")
                hasShownToast.current = true
            }
            else if(data?. lead && !hasShownToast.current){
                toast.success("Leads loaded successfully")
                hasShownToast.current=true
            }
        }
    },[loading,data,error])

    useEffect(()=>{
        async function loadAgents(){
            try {
                const res = await fetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/sales-agents")
                const data = await res.json()
                setAgents(data.agent || [])  
            } catch (error) {
                console.log("Failed to load agents ", error)
                
            }
        }
        loadAgents()
    },[])

    const getFilterLeads=()=>{
        let list = [...leads]

        if(statusFilter){
            list = list.filter((l)=>l.status === statusFilter)
        }

        if(agentFilter) list = list.filter((l)=> l.salesAgent === agentFilter)
        
        if(sortType){
            list.sort((a,b)=>{
                if(a.priority === sortType) return -1;
                if(b.priority === sortType) return 1;
                return 0;
            })
        }

        if(timeSort === "Shortest Time First"){
            list.sort((a,b)=> a.timeToClose - b.timeToClose)
        }else if(timeSort === "Longest Time First"){
            list.sort((a,b)=>b.timeToClose - a.timeToClose)
        }
        return list;
    }
    return(
        <div>
            <nav className="navbar navbar-light bg-light " style={{height:"60px"}}>
               <div className="w-100 d-flex justify-content-center align-items-center">
                 <h3 className="m-0 text-center">Lead List</h3> 
               </div>
            </nav>

            <div className="d-flex" style={{minHeight:"90vh"}}>
                {/* left-sidebar */}
                <div className="border-end d-flex flex-column align-items-start p-3"
                 style={{width:"220px",background:"#f8f9fa",cursor:"pointer"}}
                >
                    <button className="btn btn-secondary mb-3" onClick={()=>navigate("/")}>
                        Back to Home
                    </button>
                </div>

                {/* rigth-side content */}
                <div className="flex-grow-1 px-4 d-flex flex-column">
                    <div className="d-flex justify-content-center align-items-center mb-3" style={{height:"60px"}}>
                        <h3 className="m-0">Lead Overview</h3>
                    </div>
                    <div className="border rounded p-3 mb-4">
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p> }

                        {!loading && leads.length === 0 && (
                            <p>No Leads Available</p>
                        )}

                        {getFilterLeads().map((lead)=>(
                            <div key={lead._id}
                                className="d-flex justify-content-between border-bottom p-2"
                                style={{cursor:"pointer"}}
                                onClick={()=>navigate(`/leads/${lead._id}`)}
                            >
                                <span>{lead.name}</span>
                                <span>{lead.status}</span>
                            </div>
                        ))}
                    </div>

                    {/* filter section */}
                    <div className="border rounded p-3 d-flex flex-column gap-4">
                        <div>
                            <h5>Filters</h5>
                            <div className="d-flex flex-column gap-3 mt-2">
                                {/* status */}
                                <div>
                                    <label className="form-label">Status</label>
                                    <select className="form-select" onChange={(e)=>setStatusFilter(e.target.value)}>
                                        <option value="">All</option>
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Qualified">Qualified</option>
                                    </select>
                                </div>
                                {/* sales agent */}
                                <div>
                                    <label className="form-label">Sales Agent</label>
                                    <select className="form-select" onChange={(e)=>setAgentFilter(e.target.value)}>
                                        <option value="">All</option>
                                        {agents.map((ag)=>(
                                            <option key={ag._id} value={ag._id}>
                                                {ag.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* sort by */}
                        <div>
                            <h5>Sort by</h5>
                            <div className="d-flex flex-column gap-3 mt-2">
                                <select className="form-select" style={{width:"220px"}}
                                 onChange={(e)=>setSortType(e.target.value)}
                                >
                                    <option>Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <select className="form-select" style={{width:"220px"}} onChange={(e)=>setTimeSort(e.target.value)}>
                                    <option>Time TO Close </option>
                                    <option value="Shortest Time First">Shortest Time First</option>
                                    <option value="Longest Time First">Longest Time First</option>
                                </select>
                            </div>
                        </div>
                        {/* add button */}
                        <div>
                            <button className="btn btn-primary" onClick={()=>navigate("/leadForm")}>
                                Add New Lead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}