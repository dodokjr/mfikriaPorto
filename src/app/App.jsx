import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../assets/App.css'
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from './layout';
import Home from './components/home/home';
import CardCode from './components/home/cardCode';
import TimeLine from './components/home/timeLine';
import HomeProject from './components/project/homeProject';
import BlogHome from './components/blog/blogHome';


function App() {
  const [data , setData] = useState(null)
  useEffect(() => {
    fetch("https://api-mfikria.vercel.app/v1/home")
    .then(res => res.json())
    .then(body => setData(body))
    .catch(error => console.error("api not respons,plese call me: ffikri604@gmail.com"))
  }, [])

  if(!data) return <div className='flex  content-center justify-center items-center'>Loding 🚀🚀🚀<a href='mailto:ffikri604@gmail.com' className='btn'>ffikri604@gmail.com</a></div>
  return (
    <Layout >
      <div  className="diff aspect-[16/9]">
        <div className="diff-item-1">
          <div className="bg-white text-blue-600 text-9xl font-black grid place-content-center">Mfikria</div>
        </div>
          <div className="diff-item-2">
          <div className="bg-blue-600 text-9xl font-black text-white grid place-content-center">Mfikria</div>
        </div>
      <div className="diff-resizer"></div>
    </div>
    <Home data={data}/>
    <TimeLine/>
    <HomeProject api={data}/>
    <BlogHome api={data}/>
    </Layout>
  )
}

export default App
