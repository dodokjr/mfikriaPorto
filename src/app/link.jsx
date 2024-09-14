import React, { useEffect, useState } from 'react'
import pp from"../assets/ppa.jpg"

export default function Link() {
    const [data, setData] = useState([])

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async() => {
        const api = await fetch("https://api-mfikria.vercel.app/v1/link")
        const data = await api.json()
        setData(data.data)
    }
  return (
    <div className="p-4 m-4">
      <div className="flex items-center justify-center">
        <div className="max-w-sm p-6 bg-white border border-gray-950 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col space-y-4 items-center justify-center">
            <img src={pp} className="rounded-full" width="110" height="105"/>
            <a className="flex dark:text-white uppercase font-bold" href="#">{data.name}</a>
          </div>
          <hr className="w-48 h-1 bg-lime-950 border-0 rounded md:my-10 dark:bg-lime-500"/>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"> short summary from me </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{data.quetes}</p>
          <hr className="w-48 h-1 mx-auto my-4 bg-lime-950 border-0 rounded md:my-10 dark:bg-lime-500"/>
          <div className="flex flex-col space-y-4 dark:text-white justify-center">
            <p className="text-center">Media Sosial</p>
            {data.link_one && data.link_one.map((r,i) => {
                return(
                  <a key={i} href={`${r.href}`} target="_blank" rel="nofollow" title={r.title} className="relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-blue-600 rounded-full hover:bg-white group">
<span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
<span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">{r.title}</span>
</a>
                )
             })}
          </div>
          <hr className="w-48 h-1 mx-auto my-4 bg-lime-950 border-0 rounded md:my-10 dark:bg-lime-500"/>
          </div>
        </div>
      </div>
  )
}
