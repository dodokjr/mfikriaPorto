import React, { useState } from 'react'

export default function BlogCard({ api }) {
  if (!api || !api.data) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {api.data.map((r, i) => (
        <BlogCardItem key={r.id || i} item={r} />
      ))}
    </div>
  )
}

function BlogCardItem({ item }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 transition-all duration-300 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/5">
      
      {/* Image Container with Skeleton */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-800">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton w-full h-full bg-gray-700 animate-pulse"></div>
        )}
        <img
          alt={item.title || "Blog cover"}
          src={item.img_src}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent"></div>
        
        {item.postBy?.time && (
          <span className="absolute top-3 right-3 rounded-full bg-gray-950/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-gray-300 border border-gray-800">
            {item.postBy.time}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 sm:p-6">
        <a href={`blog/${item.slug}`} className="group-hover:text-pink-400 transition-colors">
          <h3 className="text-lg font-bold text-white tracking-tight line-clamp-2">
            {item.title}
          </h3>
        </a>
        
        <p className="mt-2.5 text-sm leading-relaxed text-gray-400 line-clamp-3 flex-grow">
          {item.subtitle}
        </p>

        <div className="mt-6 pt-4 border-t border-gray-800/60 flex items-center justify-between">
          <a
            href={`blog/${item.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-500 hover:text-pink-400 transition-colors"
          >
            Baca Selengkapnya
            <span className="text-sm">&rarr;</span>
          </a>
        </div>
      </div>
    </article>
  )
}