import React from 'react';
import { FaGithub, FaInstagram, FaYoutube, FaLinkedin, FaSteam, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import Type from './type';
import PP from "../../../assets/documents/pp_merah_new.jpg";

export default function Home({ data }) {
  if (!data) return null;
  const size = 24;

  return (
    <section id="home" className="pt-32 pb-16 transition-colors duration-300 dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:justify-between">
          
          {/* Bagian Teks */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            <div>
              <h1 className="text-lg font-semibold text-primary md:text-xl">
                Halo Semua 👋, saya
                <span className="mt-2 block text-4xl font-extrabold tracking-tight text-dark dark:text-white lg:text-5xl">
                  {data.data.name}
                </span>
              </h1>
              <h2 className="mt-2 flex items-center gap-2 text-lg font-medium text-secondary lg:text-2xl">
                💻 <span className="text-dark dark:text-white"><Type /></span>
              </h2>
            </div>

            <p className="text-base font-medium leading-relaxed text-secondary lg:text-lg">
              {data.data.about} : <span className="font-semibold text-dark dark:text-white">{data.data.code}</span> {data.data.about_and} <span className="font-semibold text-dark dark:text-white">{data.data.skill}</span>
            </p>

            {/* Tombol & Badge */}
            <div className="flex flex-wrap items-center gap-6">
              <a 
                href="mailto:ffikri604@gmail.com" 
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30"
              >
                Contact Me
              </a>
              <img 
                src="https://komarev.com/ghpvc/?username=dodokjr&label=Visitors&color=2836F0&style=flat" 
                alt="Profile visitor" 
                className="h-7" 
              />
            </div>

            {/* Media Sosial */}
            <div className="mt-4 flex flex-wrap gap-5 text-gray-500 dark:text-gray-400">
              <a href={data.data.media_sosial.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-gray-900 dark:hover:text-white"><FaGithub size={size} /></a>
              <a href={data.data.media_sosial.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-pink-500"><FaInstagram size={size} /></a>
              <a href={data.data.media_sosial.youtube} target="_blank" rel="noreferrer" className="transition-colors hover:text-red-500"><FaYoutube size={size} /></a>
              <a href={data.data.media_sosial.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-blue-600"><FaLinkedin size={size} /></a>
              <a href={data.data.media_sosial.discord} target="_blank" rel="noreferrer" className="transition-colors hover:text-indigo-500"><FaDiscord size={size} /></a>
              <a href={data.data.media_sosial.steam} target="_blank" rel="noreferrer" className="transition-colors hover:text-blue-900 dark:hover:text-blue-400"><FaSteam size={size} /></a>
              <a href={data.data.media_sosial.twitter} target="_blank" rel="noreferrer" className="transition-colors hover:text-gray-900 dark:hover:text-white"><FaXTwitter size={size} /></a>
            </div>
          </div>

          {/* Bagian Gambar */}
          <div className="flex w-full justify-center lg:w-1/2 lg:justify-end">
            <div className="relative">
              <img 
                src={PP} 
                alt={data.data.name} 
                className="relative z-10 w-64 rounded-3xl object-cover shadow-2xl transition-transform duration-500 hover:-translate-y-2 lg:w-80" 
              />
              {/* Efek Glow di Belakang Gambar */}
              <div className="absolute -inset-4 z-0 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 opacity-20 blur-2xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}