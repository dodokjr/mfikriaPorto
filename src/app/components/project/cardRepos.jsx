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
                {r.language ? <span className='text-white btn'>Code: {r.language} <FaCode size={15}/></span> : null}
                <hr/>
                <a href={r.svn_url} target='_blank' className="relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold group">
<span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
<span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
<span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">Github</span>
<span className="absolute inset-0 border-2 border-white"></span>
</a>
                <a href={`/project/${r.name}`} className="relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold group">
<span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
<span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
<span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">{r.name}</span>
<span className="absolute inset-0 border-2 border-white"></span>
</a>
                {r.homepage ? <a href={r.homepage} target='_blank' className="relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold group">
<span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
<span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
<span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">Website</span>
<span className="absolute inset-0 border-2 border-white"></span>
</a> : null}
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
