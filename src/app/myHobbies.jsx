import React, { useEffect, useState } from 'react'
import Layout from './layout'
import Benner from './components/myHobbies/benner'
import InstagramFeed from './components/myHobbies/instagramFeed'
import Music from './components/myHobbies/music'
import Games from './components/myHobbies/Games'
import GamesTwo from './components/myHobbies/GameTwo'
import GamesThree from './components/myHobbies/GamesThree.jsx'
import GamesFour from './components/myHobbies/GamesFour.jsx'
import GamesFive from './components/myHobbies/GamesFive.jsx'
import GamesSix from './components/myHobbies/GameSix.jsx'
import { IoReload } from 'react-icons/io5'

export default function MyHobbies() {
  const [dataIg, setDataIg] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const api = await fetch("https://api-mfikria.vercel.app/mfikria/c/ig")
      const data = await api.json()
      setDataIg(data)
    } catch (error) {
      console.error("Data failed to fetch", error)
      setDataIg({ data: [] })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center">
            <IoReload className="w-8 h-8 text-pink-500 animate-spin mb-4" />
            <h2 className="text-sm font-bold text-white mb-1">Memuat Hobi...</h2>
            <p className="text-xs text-gray-400">Mohon tunggu sebentar.</p>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <main className="bg-gray-950 min-h-screen">
        <Benner />
        <InstagramFeed api={dataIg?.data || []} />
        <Music />
        
        <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
          <Games />
          <GamesTwo />
          <GamesThree/>
          <GamesFour/>
          <GamesFive/>
          <GamesSix/>
        </div>
        
      </main>
    </Layout>
  )
}