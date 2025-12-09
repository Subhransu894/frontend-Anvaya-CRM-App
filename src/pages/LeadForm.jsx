import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { toast } from "react-toastify";
export default function LeadForm(){
    const {data:agentData, loading:agentLoading, error:agentError}=useFetch("http://localhost:3000/api/sales-agents")
    // console.log(agentData)
    const navigate = useNavigate()
    const[formData,setFormData]=useState({
        name:"",
        leadSource:"",
        agent:"",
        leadStatus:"",
        tags:{
            highValue:false,
            followUp:false
        },
        timeToClose:"",
        priority:"",
    })
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState("")
    const[success,setSuccess]=useState("")
    //for text fields
    const handleChange=(e)=>{
        const {name,value}=e.target
        setFormData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    //for checkbox fileds
    const handleCheckBox=(e)=>{
        const{name,checked}=e.target
        setFormData((prev)=>({
            ...prev,
            tags: {
            ...prev.tags,
            [name]: checked
        }
        }))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true)
        setError("")
        setSuccess("")
        
        //in my backend i have made the tags to recive as an array so do this
        const submitData={
            name:formData.name,
            source: formData.leadSource,
            salesAgent: formData.agent,
            status: formData.leadStatus,
            tags:Object.entries(formData.tags)
                        .filter(([k,v])=>v)
                        .map(([k])=>k),
            timeToClose: formData.timeToClose,
            priority: formData.priority
        }

        try {
            const res =await fetch("http://localhost:3000/api/leads",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(submitData)
            })
            const data = await res.json()

            if(!res.ok){
                setError(data.message || "Failed to creae lead")
                toast.error(data.message || "Failed to create lead")
                setLoading(false)
                return
            }
            setSuccess("Lead created successfully")
            toast.success("Lead created successfully")
            setLoading(false)

            setFormData({
                name:"",
                leadSource:"",
                agent:"",
                leadStatus:"",
                tags:{
                    highValue:false,
                    followUp:false
                },
                timeToClose:"",
                priority:"",
            })
            navigate("/leadList")
            
        } catch (error) {
            console.log("Server Error: "+error.message)
            toast.error("server error! please try again")
            setLoading(false)
        }
        
    }
    return(
        <>
            <div className="d-flex flex-column  justify-content-center align-items-center py-5" style={{ minHeight:"100vh",paddingLeft:"10px",paddingRight:"10px" }}>
                <h4 className="text-center mb-2">Lead Form</h4>
                <form className="p-4 border rounded bg-white" onSubmit={handleSubmit} style={{ maxWidth: "380px",width:"100%" }}>
                    {loading && ( <p className="text-center">Loading...</p> )}
                    {error && ( <p className="text-center text-danger">{error}</p> )}
                    {success && ( <p className="text-center text-success">{success}</p> )}

                    <label htmlFor="nameField" className="form-label">Name:</label>
                    <input type="text" name="name" value={formData.name} id="nameField" className="form-control" 
                        onChange={handleChange}
                    />
                    <br />

                    <label htmlFor="sourceField" className="form-label">Lead Source:</label>
                    <select id="sourceField" name="leadSource" value={formData.leadSource} className="form-control"
                        onChange={handleChange}
                    >
                        <option value="">Select One</option>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                    </select>
                    <br />

                    <label htmlFor="agentField" className="form-label">Sales Agent:</label>
                    <select id="agentField" name="agent" value={formData.agent} className="form-control"
                        onChange={handleChange}
                    >
                        <option value="">select One</option>
                        
                        
                        {!agentLoading && agentData?.agent?.map((a)=>(
                            <option key={a._id} value={a._id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                    <br />

                    <label htmlFor="leadField" className="form-label">Lead Status:</label>
                    <select id="leadField" name="leadStatus" value={formData.leadStatus} className="form-control" 
                        onChange={handleChange}
                    >
                        <option value="">Select One</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <br />

                    <label className="form-label">Tags:</label>
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="tagHigh" name="highValue" checked={formData.tags?.highValue || false} 
                                 onChange={handleCheckBox}
                            />
                            <label htmlFor="tagHigh" className="form-check-label">High Value</label>
                            </div>
                            <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="tagFollow" name="followUp" checked={formData.tags?.followUp || false}
                             onChange={handleCheckBox}
                            />
                            <label htmlFor="tagFollow"  className="form-check-label">Follow Up</label>
                        </div>
                    <br />

                    <label htmlFor="timeField" className="form-label">Time To Close (in days):</label>
                    <input type="number" id="timeField" name="timeToClose" value={formData.timeToClose} onChange={handleChange} className="form-control" min="0" />
                    <br />

                    <label htmlFor="priorityField" className="form-label">Priority:</label>
                    <select id="priorityField" name="priority" value={formData.priority} onChange={handleChange} className="form-control">
                        <option value="">Select One</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <br /><br />
                    <button type="submit" className="btn btn-primary d-block mx-auto">
                        {loading ? "Saving...": "Submit"}
                    </button>
                </form>
            </div> 
        </>
    )
}