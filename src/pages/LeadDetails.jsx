import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef } from "react";
export default function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    //toast effect restrict to only once
    const loadedOnce = useRef(false)

    const { data, loading, error } = useFetch(`https://backend-anvaya-crm-app-w3ca.vercel.app/api/leads/${id}`);
    // const lead = data?.lead;
    const [leadData,setLeadData]=useState(null)

    useEffect(()=>{
        if(data?.lead){
            setLeadData(data.lead)
        }
    },[data])

    const [allAgents,setAllAgents]=useState([])
    const [comments, setComments] = useState(leadData?.comments || []);
    const [newComment, setNewComment] = useState("");

    const [isEditing,setIsEditing]=useState(false);
    const [editForm,setEditForm]=useState({
        name:"",
        salesAgent:"",
        source:"",
        status:"",
        priority:"",
        timeToClose:"",
        tags:{
            highValue:false,
            followUp:false,
        },
    })
    useEffect(()=>{
        if(!loading && !error && data?.lead && !loadedOnce.current){
            toast.success("Lead details loaded successfully") 
            loadedOnce.current = true
        }
    },[loading,error,leadData])

    useEffect(()=>{
        async function fetchAgents(){
            try {
                const res = await fetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/sales-agents")
                const data = await res.json()
                const agentsArr = Array.isArray(data.agent) ? data.agent : []
                setAllAgents(agentsArr)
                console.log("All agents", agentsArr)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAgents()
    },[])
    // Refresh comments when lead updates for lead
    useEffect(() => {
        if(!leadData || !allAgents.length) return;

            const assigned = leadData.salesAgent?._id || leadData.salesAgent
            const agentObj = allAgents.find((a)=>a._id == assigned)

            setEditForm({
                name:leadData.name,
                source: leadData ?. source,
                status: leadData?. status,
                priority: leadData?.priority,
                timeToClose: leadData?.timeToClose,
                salesAgent: agentObj || null,
                tags:{
                    highValue: leadData.tags?.includes("highValue") || false,
                    followUp: leadData.tags?.includes("followUp") || false,
                },
            });
    }, [leadData,allAgents]);

    const handleEditChange = (e)=>{
        const {name,value,type,checked}=e.target
        if(name === "highValue" || name === "followUp"){
            setEditForm((prev)=>({
                ...prev,
                tags:{
                    ...prev.tags,
                    [name]:checked,
                }
            }));
            return;
        }
        setEditForm((prev)=>({...prev,[name]:value}))
    }

    const handleSaveData =async(e)=>{
        const tagArray = Object.entries(editForm.tags)
                    .filter(([k,v])=> v)
                    .map(([k])=>k)
        const submitData = {
            ...editForm,
            salesAgent: editForm.salesAgent._id,
            tags:tagArray,
        }
        const res =await  fetch(`https://backend-anvaya-crm-app-w3ca.vercel.app/api/leads/update/${id}`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(submitData),
        });
        if(res.ok){
            toast.success("Lead updated successfully")
            setIsEditing(false)
            // window.location.reload() //update UI

            setLeadData({
                ...leadData,
                ...submitData,
                salesAgent:editForm.salesAgent
            })
        }else{
            alert("Failed to update lead");
        }
    }

    const handleAgentChange=(e)=>{
        const selected = allAgents.find((a)=>a._id === e.target.value);
        setEditForm((prev)=>({...prev,salesAgent: selected || null}))
    }
    //useeffect foor comment
    useEffect(()=>{
        if(!id) return
        
        async function fetchComments(){
            const res = await fetch(`https://backend-anvaya-crm-app-w3ca.vercel.app/api/comments/lead/${id}`);
            const data = await res.json()
            if(res.ok){
                setComments(data.comments || [])
            }
        }
        fetchComments()
    },[id])

    const handleAddComment = async() => {
        if (!newComment.trim()) return;
        try {
            const authorId = typeof leadData.salesAgent === "object" ? leadData.salesAgent._id : leadData.salesAgent;
             const commentObj = {
                lead: id,
                author: authorId,
                commentText: newComment,
            };
            const res = await fetch("https://backend-anvaya-crm-app-w3ca.vercel.app/api/comments",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(commentObj)
            });
            const data =await res.json()
            if(res.ok){
                toast.success("Commennt added")
                //find the autor obj
                const authorObj = typeof leadData.salesAgent === "object" ? leadData.salesAgent : allAgents.find((a)=>a._id === leadData.salesAgent);
                //full comment obj
                const newCommentObj = {
                    ...data.message,
                    author: authorObj
                }
                //add comment on ui
                setComments((prev)=>[...prev,newCommentObj]);
                setNewComment("");
            }else{
                alert("Failed to add comment")
            }
        } catch (error) {
            console.error(error)
            alert("Error while adding comment")
        }
        
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!leadData) return <p>No lead found</p>;

    return (
        <div>
            {/* NAVBAR */}
            <nav className="navbar navbar-light bg-light" style={{ height: "60px" }}>
                <div className="container d-flex justify-content-center align-items-center h-100">
                    <h3 className="m-0">Lead Management: {leadData.name}</h3>
                </div>
            </nav>

            <div className="d-flex" style={{ minHeight: "90vh" }}>
                {/* LEFT SIDEBAR */}
                <div
                    className="border-end d-flex flex-column align-items-start p-3"
                    style={{ width: "220px", background: "#f8f9fa", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <button className="btn btn-secondary mb-3">Back to Home</button>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-grow-1 px-4">
                    {/* TITLE */}
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "60px" }}>
                        <h4 className="m-0">Lead Details</h4>
                    </div>

                    {/* LEAD DETAILS BOX */}
                    <div className="border rounded p-3 mb-4">
                        <p><strong>Name:</strong> {leadData.name}</p>
                        <p><strong>Sales Agent:</strong> { leadData.salesAgent?.name || allAgents.find((a)=>a._id === leadData.salesAgent)?.name ||"Not Assigned"}</p>
                        <p><strong>Source:</strong> {leadData.source}</p>
                        <p><strong>Status:</strong> {leadData.status}</p>
                        <p><strong>Priority:</strong> {leadData.priority}</p>
                        <p><strong>Time to Close:</strong> {leadData.timeToClose} days</p>

                        <button className="btn btn-primary mt-2 w-100" onClick={()=>setIsEditing(true)}>Edit Lead details</button>
                    </div>

                    {/* COMMENTS */}
                    <div className="border rounded p-3 mb-4">
                        <h5>Comments</h5>
                        <hr />

                        {comments.length === 0 && <p>No comments yet.</p>}

                        {comments.map((c, idx) => (
                            <div key={idx} className="mb-3">
                                <p>
                                    <strong>{c.author?.name}</strong> -
                                    {new Date(c.createdAt).toLocaleString()}
                                </p>
                                <p><strong>Comment:</strong> {c.commentText}</p>
                            </div>
                        ))}

                        <div>
                            <textarea
                                className="form-control mb-2"
                                placeholder="Add a new comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>

                            <button className="btn btn-success" onClick={handleAddComment}>
                                Submit Comment
                            </button>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    {isEditing && (
                        <div style={{position:"fixed",top:0,left:0,
                            width:"100%",height:"100%",
                            background:"rgba(0,0,0,0.5)",
                            display:"flex",justifyContent:"center",alignItems:"center"}}
                        >
                            <div className="bg-light p-4 rounded" style={{width:"400px"}}>
                                <h4>Edit Lead</h4>

                                <label>Name:</label>
                                <input type="text" name="name" value={editForm.name} 
                                    className="form-control mb-2" onChange={handleEditChange}
                                />

                                <label>Source:</label>
                                <select name="source" value={editForm.source} className="form-control mb-2"
                                    onChange={handleEditChange}
                                >
                                    <option value="">Select Source</option>
                                    <option value="Website">Website</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Cold Call">Cold Call</option>
                                    <option value="Advertisement">Advertisement</option>
                                    <option value="Email">Email</option>
                                    <option value="Other">Other</option>
                                </select>

                                <label>Sales Agents:</label>
                                <select name="salesAgent" value={editForm.salesAgent?._id || ""} 
                                    className="form-control mb-2"onChange={handleAgentChange}
                                >
                                    <option value="">Select Agent</option>
                                    {allAgents.map((agent)=>(
                                        <option value={agent._id} key={agent._id}>{agent.name}</option>
                                    ))}
                                </select>

                                <label>Status:</label>
                                <select name="status" value={editForm.status} className="form-control mb-2"
                                    onChange={handleEditChange}
                                >
                                    <option value="">Select Status</option>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Proposal Sent">Proposal Sent</option>
                                    <option value="Closed">Closed</option>
                                </select>

                                <label>Priority:</label>
                                <select name="priority" value={editForm.priority} className="form-control mb-2"
                                    onChange={handleEditChange}
                                >
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>

                                <label>Time to Close:</label>
                                <input type="text" name="timeToClose" value={editForm.timeToClose} 
                                    className="form-control mb-2" onChange={handleEditChange}
                                />

                                <label >Tags:</label>
                                <div className="d-flex gap-3 mb-2">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" name="highValue" checked={editForm.tags.highValue} 
                                            onChange={handleEditChange}
                                            id="tagHighVal"
                                        />
                                        <label className="form-check-label" htmlFor="tagHighVal">High Value</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input"  name="followUp" checked={editForm.tags.followUp} 
                                            onChange={handleEditChange}
                                            id="tagFollowUp"
                                        />
                                        <label className="form-check-label" htmlFor="tagFollowUp">Follow Up</label>
                                    </div>  
                                </div>
                                 <button type="button" className="btn btn-success mt-3 w-100" onClick={handleSaveData}>Save Changes</button>
                                 <button type="button" className="btn btn-danger mt-2 w-100" onClick={()=>setIsEditing(false)}>Cancel</button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
