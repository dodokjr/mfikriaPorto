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
  return (
    <Layout>
<header className="p-2">
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Welcome To My Blog!!</h1>
        <p className="mt-1.5 text-sm text-blue-200">My blog post!! 🎉</p>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
        {data.data && data.data.map((r,i) => {
          return(
            <a
  className="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring"
  href={`blog/${r.slug}`} key={i}
>
  <span
    className="absolute inset-y-0 left-0 w-[2px] bg-indigo-600 transition-all group-hover:w-full group-active:bg-indigo-500"
  ></span>

  <span
    className="relative text-sm font-medium text-white transition-colors group-hover:text-white"
  >
    Blog ({r.id})
  </span>
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

