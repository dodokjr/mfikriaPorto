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
          <div className='flex justify-center grid-cols-2 gap-6'>
          <img width="29.5%" src="https://github-readme-streak-stats.herokuapp.com?user=dodokjr&theme=tokyonight&hide_border=true&border_radius=5&mode=weekly" alt="dodokjr GitHub streak"/>
        <img  width="49.5%" src="http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=dodokjr&theme=aura" alt="Dodokjr GitHub Contribution"/>
          </div>
        <div className='flex justify-center p-2'>
        <img  alt="Dodokjr Top Languages" src="https://denvercoder1-github-readme-stats.vercel.app/api/top-langs/?username=dodokjr&langs_count=8&layout=compact&theme=react&border_color=00083B&bg_color=00083B&title_color=DAD0FEF&icon_color=F5E572" height="155px" width="29.5%"/>
        </div>
        <div className='flex justify-center'>
        <img width={1000} height={1000} src='https://github-readme-activity-graph.vercel.app/graph?username=dodokjr&custom_title=Dodokjr%27s%20GitHub%20Activity%20Graph&bg_color=00083B&color=6E49F5&line=6E49F5&point=6E49F5&area_color=0000&title_color=DAD0FE&area=true'/>
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
