import React from 'react'
import Header from '../utilities/header'
import Img from "../../../assets/ff.png"

export default function HomeProject({api}) {
  return (
    <>
    <section className="bg-white dark:bg-gray-900">
    <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">My Project
        </h1>
        <p className="mt-4 text-center text-gray-500 dark:text-gray-300">
            Project 
        </p>
        <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3'>
            {api.data.project.map((r,i) => {
                return(
                    <div className="overflow-hidden bg-cover rounded-lg cursor-pointer h-96 group"
                style={{backgroundImage : `url('${r.img_url}')`}} key={i}>
                <div
                    className="flex flex-col justify-center w-full h-full px-8 py-4 transition-opacity duration-700 opacity-0 backdrop-blur-sm bg-gray-800/60 group-hover:opacity-100">
                    <h2 className="mt-4 text-xl font-semibold text-white capitalize">{r.title}</h2>
                    <span className='mt-4 text-sm text-yellow-50'>{r.descriptions}</span>
                    <a className="mt-2 text-lg tracking-wider text-blue-400 uppercase " href={`${r.url_github}`}>Github</a>
                    <a className="mt-2 text-lg tracking-wider text-blue-400 uppercase " href={`${r.url_demo}`}>Demo</a>
                </div>
            </div>
                )
            })}
            <div className="overflow-hidden bg-cover rounded-lg cursor-pointer h-96 group"
                style={{backgroundImage : `url('${Img}')`}}>
                <div
                    className="flex flex-col justify-center w-full h-full px-8 py-4 transition-opacity duration-700 opacity-0 backdrop-blur-sm bg-gray-800/60 group-hover:opacity-100">
                    <h2 className="mt-4 text-xl font-semibold text-white capitalize">Project and github repos</h2>
                    <a className="mt-2 text-lg tracking-wider text-blue-400 uppercase " href="/project">Project ++</a>
                </div>
            </div>
            
        </div>
    </div>
    </section>
    </>
  )
}
