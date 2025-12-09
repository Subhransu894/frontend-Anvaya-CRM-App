import {  useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import {Pie,Bar} from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend,BarElement, CategoryScale, LinearScale } from "chart.js";
import { toast } from "react-toastify";
import { useRef } from "react";

ChartJS.register(ArcElement,BarElement,CategoryScale,LinearScale,Tooltip,Legend)

export default function Report(){
    const navigate = useNavigate()
    //chart states
    const[closedPipeline,setClosedPipeline]=useState(null)
    const[closedByAgent,setClosedByAgent]=useState([])
    const[statusDistribution,setStatusDistribution]=useState([]) 
    const hasShownToast = useRef(false)
    
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState("")


    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const res1=await fetch("http://localhost:3000/api/reports/closed-pipeline")
                const res2=await fetch("http://localhost:3000/api/reports/closed-by-agents")
                const res3=await fetch("http://localhost:3000/api/reports/status-distribution")

                const data1 = await res1.json()
                const data2 = await res2.json()
                const data3 = await res3.json()

                setClosedPipeline(data1)
                setClosedByAgent(data2)
                setStatusDistribution(data3)

                setLoading(false)
                if(!hasShownToast.current){
                    toast.success("Report loaded successfully")
                    hasShownToast.current = true
                }
            } catch (error) {
                setError("Failed to load report data")
                toast.error("Failed to load report", {position:"top-right"})
                setLoading(false)
                if(!hasShownToast.current){
                    toast.error("Failed to load report")
                    hasShownToast.current=true
                }
            }
        }
        fetchData()
    },[])

    if(loading) return ( <p className="text-center mt-5">Loading...</p> )
    if(error) return ( <p className="text-center mt-5">{error}</p> )

    //closed pipline
    const pieData = {
        labels: ["Closed","Pipeline"],
        datasets:[
            {
                data:[closedPipeline.closed,closedPipeline.pipeline],
                backgroundColor: ["#42a5f5","#66bb6a"]
            }
        ]
    }

    //closed By agent
    const barDataAgents={
        labels:closedByAgent.map((a)=>a.agentName),
        datasets:[
            {
                label:"Closed Leads",
                data: closedByAgent.map((a)=> a.totalClosed),
                backgroundColor:"#42a5f5"
            }
        ]
    }

    //status distribution
    const barStatus = {
        labels:statusDistribution.map((s)=>s.status),
        datasets:[
            {
                label:"Lead Count",
                data: statusDistribution.map((s)=>s.count),
                backgroundColor:"#42a5f5"
            }
        ]
    }
    return(
        <div className="container-fluid p-0">
            {/* navbar */}
            <nav className="navbar navbar-bg bg-light ">
                <div className="container d-flex justify-content-center ">
                    <h2 className="mb-2 ">Anvaya CRM Report</h2>
                </div>
            </nav>

            <div className="row" style={{height:"100vh"}}>
                {/* left sidebar */}
                <div className="col-12 col-md-3 col-lg-2 bg-light  border-end d-flex flex-column p-3">
                    <button className="btn btn-secondary" onClick={()=>navigate("/")}>Back To Home</button>
                </div>

                {/* right sidebar */}
                <div className="col-12 col-md-9 col-lg-10 p-4">
                    <h3 className="text-center">Report Overview</h3>

                    <div className="card p-3 mb-4 " style={{height:"370px",textAlign:"center"}}> 
                        <h5>Total Leads closed and in Pipeline(pie chart)</h5>
                        <div style={{height:"300px",textAlign:"center"}} >
                            <Pie data={pieData} options={{maintainAspectRatio:false}}/>
                        </div>
                    </div>

                    <div className="card p-3 mb-4"  style={{height:"370px",textAlign:"center"}}>
                        <h5>Leads closed by sales agent(bar chart)</h5>
                        <div style={{height:"300px",textAlign:"center"}}>
                            <Bar data={barDataAgents} options={{maintainAspectRatio:false}}/>
                        </div>
                    </div>

                    <div className="card p-3 mb-4"  style={{height:"370px",textAlign:"center"}}>
                        <h5>Lead Status Distribution:(bar chart)</h5>
                        <div style={{height:"300px",textAlign:"center"}}>
                            <Bar data={barStatus} options={{maintainAspectRatio:false}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}