import React, {useState, useEffect} from 'react'
import axios from "axios"

const nav = {
  logo: "mfikria",
  img_src: "aaaaaaaa",
  menubar: [{ name: "home", url: "/" }, { name: "Project", url: "/Project" }, {name: "Blog", url:"/blog"}, {name:"My hobbies", url:"/hobbies"}],
  github_button: {
      name: "Github/Dodokjr",
      url: "https://github.com/dodokjr"
  }
}
export default function Navbar() {
  if(!nav) return null
  return (
    <>
    <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        {nav.menubar.map((r, index) => {
          return(
            <li key={index + 1}><a href={r.url}>{r.name}</a></li>
          )
        })}
      </ul>
    </div>
    <a className="btn btn-ghost text-xl">{nav.logo}</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    {nav.menubar.map((r, index) => {
          return(
            <li key={index + 1}><a href={r.url}>{r.name}</a></li>
          )
        })}
    </ul>
  </div>
  <div className="navbar-end">
    <a className="btn" href="#">Link</a>
  </div>
</div>
    </>
  )
}
