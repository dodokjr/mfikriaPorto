import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function Contac() {
  const {id} = useParams()
  const [data, setData] = useState([])
  useEffect(() => {
    const fecthData = async() => {
        const api = await fetch(`https://api-mfikria.vercel.app/v2/github/${id}`)
        const data = await api.json()
        setData(data)
    }
    fecthData()
  }, [])

  if(data.limiter) return <div>data Limiter</div>
    return (
    <div className='flex justify-center items-center p-4'>
    <p>id : {id}</p>
    <div>Github : {data.login}</div>
    <img src={data.avatar_url} width={100} height={100} alt='....'/>
    </div>
  )
}
