import React from 'react'

export default function Header({url, urlTitle, title}) {
  return (
    <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold text-color-accent">{title}</h1>
            {
                url && urlTitle ?
                    <a href={url} className="md:text-xl text-md underline text-white hover:text-blue-600 transition-all">{urlTitle}</a>
                    : null
            }

        </div>
  )
}
