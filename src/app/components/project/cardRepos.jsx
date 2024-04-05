import React from 'react'
import { format } from 'date-fns';
import { FaGithub, FaCodeFork } from 'react-icons/fa6'
import { FaStar, FaEye, FaFileCode, FaCode } from "react-icons/fa";

export default function CardRepos({api}) {
  return (
    <div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 px-4'>
        {api.map((r, i) => {
            return(
                <div className='card border border-spacing-2 rounded-md scale-up-ver-bottom' key={r.id}>
                <div className='card-body'>
                    <img src={r.owner.avatar_url} className='rounded-md'/>
                <div className='card-title justify-center'>{r.name}</div>
                <div className='font-bold'>{r.description}</div>
                <span className='text-white btn'>Stars : {r.stargazers_count}<FaStar size={15}/></span>
                <span className='text-white btn'>Wacth : {r.watchers_count} <FaEye size={15}/></span>
                <span className='text-white btn'>forks: {r.forks_count} <FaCodeFork size={15}/></span>
                <span className='text-white btn'>Size: {r.size}mb <FaFileCode size={15}/></span>
                <span className='text-white btn'>Code: {r.language} <FaCode size={15}/></span>
                <hr/>
                <a href={r.url} target='_blank' className='py-3 px-2 text-white font-bold border border-white btn'><FaGithub/>Github</a>
                {r.homepage ? <a href={r.homepage} target='_blank' className='py-3 px-2 text-white font-bold border border-white btn'>HomePage</a> : null}
                <div className='p-2'>
                    Create At : {format(new Date(r.created_at), "dd MMMM yyyy")},
                    Update At : {format(new Date(r.updated_at), "dd MMM yyyy")},
                </div>
                </div>
            </div>
            )
        })}
    </div>
  )
}
