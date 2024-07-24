import React, { useEffect, useState } from 'react'

export default function getApiCall()
{
    const [data, setData] = useState()
    
    const fetchData = async() => {
        const api = await fetch("https://api-mfikria.vercel.app/v1/link")
        const data = await api.json()
        setData(data.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return data
}
