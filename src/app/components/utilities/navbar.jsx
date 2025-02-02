import React, {useState, useEffect} from 'react'
import axios from "axios"

const nav = {
  logo: "mfikria",
  img_src: "aaaaaaaa",
  menubar: [{ name: "home", url: "/app" }, { name: "Project", url: "/Project" }, {name: "Blog", url:"/blog"}, {name:"My hobbies", url:"/hobbies"}, {name: "Chat AI", url:"chatAi"}],
  github_button: {
      name: "Github/Dodokjr",
      url: "https://github.com/dodokjr"
  }
}
export default function Navbar() {
  if(!nav) return null
  return (
    <>
    <div className="navbar bg-slate-800">
  <div className="navbar-start">
    <details className="dropdown">
    <summary tabIndex={0} role="button" className="btn m-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
    </summary>
      <ul tabIndex={0} className="menu dropdown-content bg-slate-800 rounded-box z-[1] w-52 p-2 shadow">
        {nav.menubar.map((r, index) => {
          return(
            <li key={index + 1}><a href={r.url} className='text-white hover:underline hover:text-pink-500'>{r.name}</a></li>
          )
        })}
      </ul>
    </details>
    <a href="/app" className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-pink-500 rounded-xl group">
<span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-pink-300 rounded group-hover:-mr-4 group-hover:-mt-4">
<span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-gray-800"></span>
</span>
<span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-pink-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
<span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white uppercase">{nav.logo}</span>
</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    {nav.menubar.map((r, index) => {
          return(
            <li key={index + 1}><a href={r.url} className='text-white hover:underline hover:text-pink-500'>{r.name}</a></li>
          )
        })}
    </ul>
  </div>
  <div className='navbar-end'> </div>
</div>
    </>
  )
}
