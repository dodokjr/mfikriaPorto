import React, { useEffect, useState } from 'react'
import { FaGithub, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaSteam, FaDiscord } from "react-icons/fa";
import Type from './type'
import PP from"../../../assets/documents/pp_merah_new.jpg"
import { FaXTwitter } from 'react-icons/fa6';

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
          <img align="right" src="https://komarev.com/ghpvc/?username=dodokjr&label=Visitors&color=2836F0&style=flat" alt="Profile visitor" />
          <a href="mailto:ffikri604@gmail.com" className="relative px-6 py-3 font-bold text-white rounded-lg group">
<span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
<span className="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
<span className="relative">contact me</span>
</a>
        <div className='flex flex-col'>
        <div className='grid grid-cols-7 px-7 py-7'>
            <a href={data.data.media_sosial.github} target='_blank' className='mx-1.5 text-white transition-colors duration-300 transform hover:text-gray-400'><FaGithub size={size}/></a>
            <a href={data.data.media_sosial.instagram} target='_blank'  className='mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500'><FaInstagram size={size}/></a>
            <a href={data.data.media_sosial.youtube} target='_blank'  className='mx-1.5 text-white transition-colors duration-300 transform hover:text-red-600'><FaYoutube size={size}/></a>
            <a href={data.data.media_sosial.linkedin} target='_blank'  className='mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500'><FaLinkedin size={size}/></a>
            <a href={data.data.media_sosial.discord} target='_blank'  className='mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-400'><FaDiscord size={size}/></a>
            <a href={data.data.media_sosial.steam} target='_blank' className='mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-700'><FaSteam size={size}/></a>
            <a href={data.data.media_sosial.twitter} target='_blank' className='mx-1.5 text-white transition-colors duration-300 transform hover:text-gray-500'><FaXTwitter size={size}/></a>
        </div>
        </div>
        </div>
        <div className="w-full self-end px-4 lg:w-1/2">
          <div className="relative mt-10 lg:right-0 lg:mt-9">
            <img src={PP} alt={data.data.title} className="relative z-10 mx-auto max-w-full" />
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
