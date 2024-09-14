import React,{useEffect, useState} from 'react'
import Layout from './layout'
import BlogCard from './components/blog/blogCard'

export default function Blog() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const api = await fetch("https://api-mfikria.vercel.app/mfikria/c/blog")
    const res = await api.json()
    setData(res)
  }

  if(!data) return <div className="flex w-52 flex-col gap-4">
  <div className="skeleton h-32 w-full"></div>
  <div className="skeleton h-4 w-28"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
</div>
  return (
    <Layout>
<header className="p-2">
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white sm:text-3xl hover:text-pink-500">Welcome To My Blog!!</h1>
        <p className="mt-1.5 text-sm text-blue-200">My blog post!! 🎉</p>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
        {data.data && data.data.map((r,i) => {
          return(
            <a href={`blog/${r.slug}`} key={i} className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group">
<span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-pink-500 group-hover:translate-x-0 ease">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
</span>
<span className="absolute flex items-center justify-center w-full h-full text-pink-500 transition-all duration-300 transform group-hover:translate-x-full ease">Blog ({r.id})</span>
<span className="relative invisible">Blog ({r.id})</span>
</a>
          )
        })}
      </div>
    </div>
  </div>
</header>

<div className='px-3'>
  <BlogCard api={data}/>
</div>
    </Layout>
  )
}

