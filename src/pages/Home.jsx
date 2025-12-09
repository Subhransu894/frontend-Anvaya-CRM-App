import {useNavigate} from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import { useState } from "react";
export default function Home(){
    const navigate = useNavigate()
    const {data,loading,error}=useFetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/leads")

    const leads = data?.lead || [];

    const[filterStatus,setFilterStatus]=useState("")

    const handleFilterClick = (status)=>{
        setFilterStatus(prev=> prev === status ? "" : status)
    }

    const filteredLeads = filterStatus ? leads.filter((lead)=>lead.status === filterStatus) : leads;

    const statusCount={}
    leads.forEach((lead)=>{
        const st = lead.status;
        statusCount[st]=(statusCount[st] || 0)+1
    })
    return(
        <>
            <header>
                <nav className="nav bg-light p-3">
                    <div className="container text-center">
                        <h2 >Anvaya CRM Dashboard</h2>
                    </div>
                </nav>
           </header>
           <div className="container-fluid">
                <div className="row" style={{ height: "100vh" }}>

                    {/* LEFT SIDEBAR */}
                    <div className="col-12 col-md-4 bg-light border-end p-0">                
                        <ul className="list-unstyled fs-5 d-flex flex-column gap-3" 
                            style={{ border:"1px solid #ccc" , borderRadius:"5px", padding:"30px 20px",margin:"20px"}}
                        >
                            <li className="p-2" style={{cursor:"pointer"}} onClick={()=>navigate("/leadList")}>Leads</li>
                            <li className="p-2" style={{cursor:"pointer"}} onClick={()=>navigate("/salesList")}>Agents</li>
                            <li className="p-2" style={{cursor:"pointer"}} onClick={()=>navigate("/report")}>Reports</li>
                            <li className="p-2" style={{cursor:"pointer"}} onClick={()=>navigate("/setting")}>Settings</li>
                        </ul>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="col-12 col-md-8 p-4" >
                        {loading && <p>Loading...</p> }
                        {error && <p>Error loading Leads</p> }
                        
                        {/* First 3 leads */}
                        {!loading && filteredLeads.length > 0 && (
                            <div className="d-flex gap-4 mb-4">
                                {filteredLeads.slice(0,3).map((ld)=>(
                                    <span key={ld._id}>{ld.name}</span>
                                ))}
                            </div>
                        )}
                        <hr className="mb-4" />

                        {/* Lead status summary*/}
                        <div>
                            <h4>Leade Status:</h4>
                            <p>- New: [{statusCount.New || 0}] Leads</p>
                            <p>- Qualified: [{statusCount.Qualified || 0}] Leads</p>
                            <p>- Contacted: [{statusCount.Contacted || 0}] Leads</p>
                        </div>

                         <hr className="mb-4" />

                         {/* quick filters */}

                         <div className="mb-4">
                            <p><strong>Quick Filters:</strong></p>
                            <div className="d-flex gap-2 mb-3">
                                 {["New","Qualified","Contacted"].map((st)=>(
                                    <button
                                        key={st}
                                        className={`btn btn-sm ${filterStatus === st ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={()=>handleFilterClick(st)}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                            <button className="btn btn-primary" onClick={()=>navigate("/leadForm")}>
                                Add New Lead
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </>
    )
}