import React from 'react'

export default function BlogHome({api}) {
  return (
    <div className="bg-white dark:bg-gray-900">
  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our Blog</h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>
      </div> 
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8'>
        {api.data && api.data.blog.map((r,i) => {
            return(
           <article className="relative overflow-hidden rounded-lg shadow transition hover:shadow-lg" id={r.id} key={i}>
  <img
    alt=""
    src={r.img_src}
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
    <div className="p-4 sm:p-6">
      <span className="block text-xs text-white/90"> {r.postBy.time} </span>
      <a href={`blog/${r.slug}`}>
        <h3 className="mt-0.5 text-lg text-white">{r.title}</h3>
      </a>
      <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">
        {r.descriptions}
      </p>
    </div>
  </div>
</article>
            )
        })}
    </div>
  </div>
</div>
  )
}
