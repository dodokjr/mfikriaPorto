import React from 'react'

export default function BlogCard({api}) {
  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8'>
        {api.data && api.data.map((r,i) => {
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
        {r.subtitle}
      </p>
    </div>
  </div>
</article>
            )
        })}
    </div>
  )
}
