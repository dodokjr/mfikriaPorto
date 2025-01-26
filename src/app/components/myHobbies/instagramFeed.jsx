import React from 'react'

export default function InstagramFeed({api}) {
  if(!api) return <div className="skeleton h-64 w-64"></div>
  return (
    <section className="bg-slate-700">
    <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-white capitalize lg:text-3xl">Instagram Feed
        </h1>
        <br/>
   <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
   {api && api.map((r,i) => {
    return(
        <a href={r.url_Profile} className="blok" key={i}>
  <img
    alt="..."
    src={r.url_Image}
    className="artboard artboard-horizontal phone-1"
  />

  <div className="relative p-4 sm:p-6 lg:p-8">
    <p className="text-sm font-medium tracking-widest text-pink-500 hover:text-white">@fkri__17</p>

    <p className="text-xl font-bold text-white sm:text-2xl hover:text-pink-500">M Fikri A</p>

  </div>
        </a>
    )
   })}
   </div>
   </div>
   </section>
  )
}
