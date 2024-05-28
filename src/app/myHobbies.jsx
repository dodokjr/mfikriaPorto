import React, { useEffect, useState } from 'react'
import Layout from './layout'
import Benner from './components/myHobbies/benner'
import InstagramFeed from './components/myHobbies/instagramFeed'

export default function MyHobbies() {
  const [dataIg, setDataIg] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try{
      const api = await fetch("https://api-mfikria.vercel.app/mfikria/c/ig")
      const data = await api.json()
      setDataIg(data)
    } catch(error){console.error("data No fetch", error)}
  }
  if(!dataIg) return <div className='flex  content-center justify-center items-center'>Loding 🚀🚀🚀<a href='mailto:ffikri604@gmail.com' className='btn'>ffikri604@gmail.com</a></div>
  return (
    <Layout>
        <Benner/>
        <InstagramFeed api={dataIg.data && dataIg.data}/>
    </Layout>
  )
}
