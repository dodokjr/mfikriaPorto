import React from 'react'

export default function InstagramFeed({api}) {
  return (
    <section className="bg-white dark:bg-gray-900">
    <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">Instagram Feed
        </h1>
        <br/>
   <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
   {api && api.map((r,i) => {
    return(
        <a href={r.url_Profile} className="blok" key={i}>
  <img
    alt="..."
    src={r.url_Image}
    className="h-64 w-full object-cover sm:h-80 lg:h-96"
  />

  <div className="relative p-4 sm:p-6 lg:p-8">
    <p className="text-sm font-medium uppercase tracking-widest text-pink-500">@fkri__17</p>

    <p className="text-xl font-bold text-white sm:text-2xl">M Fikri A</p>

  </div>
   </a>
    )
   })}
   </div>
   </div>
   </section>
  )
}
