import { useEffect, useState } from 'react'
import '../assets/App.css'
import Layout from './layout';
import Home from './components/home/home';
import TimeLine from './components/home/timeLine';
import HomeProject from './components/project/homeProject';
import BlogHome from './components/blog/blogHome';
import Contac from './components/utilities/contac';
import Loading from './components/utilities/Loading';
import SectionStar from './components/home/SectionStar';


function App() {
  const [data , setData] = useState(null)
  useEffect(() => {
    fetch("https://api-mfikria.vercel.app/v1/home")
    .then(res => res.json())
    .then(body => setData(body))
    .catch(error => console.error("api not respons,plese call me: ffikri604@gmail.com"))
  }, [])

  if(!data) return <Loading/>
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
    <SectionStar/>
    <BlogHome api={data}/>
    <Contac api={data}/>
    </Layout>
  )
}

export default App
