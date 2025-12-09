import { useState,useEffect } from "react";
export  function useFetch(url){
    const[data,setData]=useState(null);
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState(null)
    async function fetchData() {
        try {
            setLoading(true)
        
            const response = await fetch(url)
            if(!response.ok){
                throw new Error ("Failed to fetch Data")
            }
            const jsonData = await response.json()
            setData(jsonData)
            setError(null)
        } catch (error) {
            setError(error.message || "Something went wrong")
            setData(null)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(url){
            fetchData();
        }
    },[url])
    return {data,loading,error}
}