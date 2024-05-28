import React, { useEffect, useState } from 'react'
import getApiCall from '../libs/api-call'
import Layout from"./layout"
import GitHubCalendar from 'react-github-calendar';
import CardRepos from './components/project/cardRepos';

export default function ProjectApp() {
  const [data , setData] = useState([])
  const [err , setErr] =useState([])
  useEffect(() => {
    fetch("https://api-mfikria.vercel.app/v2/github/dodokjr/repos")
    .then(res => res.json())
    .then(body => setData(body))
    .catch(err => console.error("api not respons,plese call me: ffikri604@gmail.com"))
    .catch(err => setErr(err))
  }, [])
  if(data.mesagge) return <div>Error Page</div>
  if(!data) return <div className='flex  content-center justify-center items-center'>Loding 🚀🚀🚀<a href='mailto:ffikri604@gmail.com' className='btn'>ffikri604@gmail.com</a></div>

  const ThemeInput = {
    light: ['#fff', "#fff", "#fff", "#fff", "#fff"],
    dark: ['#00062A', "#218800",  "#ECF305", "#FF0202", "#1519FD"],
  };
  
  return (
    <Layout>
      <div className='p-4'>
          <h1 className='font-bold text-white p-2 text-center px-4'>MY Github Ativity</h1>
        <div className='flex justify-center'>
        <GitHubCalendar username='dodokjr' blockMargin={2} blockSize={17} blockRadius={9} theme={ThemeInput} fontSize={15} totalCount={277} showWeekdayLabels/>
        </div>
        <div className='p-4'>
          <h1 className='font-bold text-center text-white'>MY REPOS DODOKJR</h1>
          <div className='px-2 py-4'>
          {data ? <CardRepos api={data}/> : <div className='text-center'>api not respons, plese call me : <a href='mailto:ffikri604@gmail.com' className='btn'>ffikri604@gmail.com</a></div>}
          </div>
        </div>
      </div>
    </Layout>
  )
}
