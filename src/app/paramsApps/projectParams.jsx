import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns';
import Layout from '../layout'
import { FaHtml5 } from "react-icons/fa";

export const ProjectParams = () => {
  const {id} = useParams()
  const [data, setData] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
   fetchData()
   eventsApi()
  }, [])

  const fetchData = async() => {
    try{
        const data = await fetch(`https://api.github.com/repos/dodokjr/${id}`)
        const body = await data.json()
        setData(body)
    } catch(error) {
        console.log("fetch data error :", error)
    }
  }

  const eventsApi = async() => {
    try{
        const data = await fetch(`https://api.github.com/repos/dodokjr/${id}/events`)
        const body = await data.json()
        setEvents(body)
    } catch(error) {
        console.log("error data fetch : " ,error)
    }
  }

  if(data.message || events.message) return <div>data yang anda maksud {id} tidak ada</div>
    return (
    <Layout>
        <div className='p-8'>
            <div className='flex justify-center'>
             <img src="https://avatars.githubusercontent.com/u/67883705?v=4" alt='....' width={240} height={240} className='rounded-full'/> 
            </div>
            <h1 className='text-center font-bold text-white px-6'>Name Repos : {id} or <a target='_blank' href={data.html_url} className='btn'>{data.full_name}</a></h1>
            {data.description ? <h1 className='text-white text-center'>{data.description}</h1> : null}
            <div className=' p-2'>
                <div className='overflow-auto'>
                <table className="table table-zebra">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Type</th>
        <th>date</th>
      </tr>
    </thead>
    <tbody>
      {events.map((r , i) => 
      <tr>
        <th>{i + 1}</th>
        <th>{r.repo.name}</th>
        <td>{r.type}</td>
        <td>{format(new Date(r.created_at), "dd MMMM yyyy")}</td>
      </tr>)}
                </tbody>
            </table>
                </div>
            </div>
        </div>
    </Layout>
  )
}
