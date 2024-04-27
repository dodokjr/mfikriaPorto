import React, { useEffect, useState } from 'react'
import { FaGithub, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaSteam, FaDiscord } from "react-icons/fa";
import Type from './type'

export default function Home({data}) {
    if(!data) return null
    let size = 25;
    
  return (
    <section id="home" className="pt-36 dark:bg-dark scale-down-center">
    <div className="container">
      <div className="flex flex-wrap">
        <div className="w-full self-center px-4 lg:w-1/2">
          <h1 className="text-base font-semibold text-primary md:text-xl">Halo Semua 👋, saya <span className="mt-1 block text-4xl font-bold text-dark dark:text-white lg:text-5xl">{data.data.name}</span></h1>
          <h2 className="mb-5 text-lg font-medium text-secondary lg:text-2xl">💻__<span className="text-dark dark:text-white"> <Type/></span></h2>
          <p className="mb-10 font-medium leading-relaxed text-secondary">{data.data.about} : <span className="text-dark dark:text-white">{data.data.code}</span> {data.data.about_and} <span className="text-dark dark:text-white">{data.data.skill}</span></p>

          <a href="mailto:ffikri604@gmail.com" className="rounded-full bg-primary py-3 px-8 text-base font-semibold text-white transition duration-300 ease-in-out hover:opacity-80 hover:shadow-lg">Hubungi Saya</a>
        <div className='flex flex-col'>
        <div className='grid grid-cols-7 px-7 py-7'>
            <a href={data.data.media_sosial.github} className=''><FaGithub size={size}/></a>
            <a href={data.data.media_sosial.instagram}><FaInstagram size={size}/></a>
            <a href={data.data.media_sosial.youtube}><FaYoutube size={size}/></a>
            <a href={data.data.media_sosial.linkedin}><FaLinkedin size={size}/></a>
            <a href={data.data.media_sosial.discord}><FaDiscord size={size}/></a>
            <a href={data.data.media_sosial.steam}><FaSteam size={size}/></a>
            <a href={data.data.media_sosial.twitter}><FaTwitter size={size}/></a>
        </div>
        </div>
        </div>
        <div className="w-full self-end px-4 lg:w-1/2">
          <div className="relative mt-10 lg:right-0 lg:mt-9">
            <img src={data.data.img_src} alt={data.data.title} className="relative z-10 mx-auto max-w-full" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 md:scale-125">
              <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#14b8a6"
                  d="M47.4,-51C59.2,-35.6,65.1,-17.8,63.4,-1.7C61.7,14.5,52.6,28.9,40.8,36.6C28.9,44.2,14.5,45,-2,47C-18.4,49,-36.8,52.1,-45.4,44.5C-53.9,36.8,-52.5,18.4,-51.2,1.3C-49.9,-15.8,-48.7,-31.7,-40.2,-47.1C-31.7,-62.4,-15.8,-77.3,1,-78.3C17.8,-79.2,35.6,-66.3,47.4,-51Z"
                  transform="translate(100 100) scale(1.1)"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
