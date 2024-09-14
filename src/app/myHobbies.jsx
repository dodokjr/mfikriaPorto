import React, { useEffect, useState } from 'react'
import Layout from './layout'
import Benner from './components/myHobbies/benner'
import InstagramFeed from './components/myHobbies/instagramFeed'
import Music from './components/myHobbies/music'

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
  if(!dataIg) {
    return(
      <Layout>
                <div className="flex w-52 flex-col gap-4">
  <div className="skeleton h-32 w-full"></div>
  <div className="skeleton h-4 w-28"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
</div>
            </Layout>
    )
  }
  return (
    <Layout>
        <Benner/>
        <InstagramFeed api={dataIg.data && dataIg.data}/>
        <div>Music Distro</div>
        <Music/>
    </Layout>
  )
}
