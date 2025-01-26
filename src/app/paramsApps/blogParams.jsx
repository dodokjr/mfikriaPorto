import React, { Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Layout from '../layout';

export default function BlogParams() {
    const {id} = useParams()
    const [res, setRes] = useState([])

    useEffect(() => {
        fetchData()
    },[])
    
    const fetchData = async () => {
        const api = await fetch(`https://api-mfikria.vercel.app/mfikria/c/blog/${id}`)
        const data = await api.json()
        setRes(data.data)
    }
    if(!res) {
        return(
            <Layout>
                <div className="flex w-52 flex-col gap-4">
  <div className="skeleton h-32 w-full"></div>
  <div className="skeleton h-4 w-28"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
</div>
            </Layout>
        )
    }
  return (
    <Layout>
        <Suspense fallback={<div>Loading....</div>}>
        <div className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-slate-800 antialiased">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                <header className="mb-4 lg:mb-6 not-format">
                    <address className="flex items-center mb-6 not-italic">
                        <div className="inline-flex items-center mr-3 text-sm text-white dark:text-white">
                        <img className="mr-4 w-16 h-16 rounded-full" src={res.postBy && res.postBy.img_profile} alt="Jese Leos" />
                            <div>
                                <a href="#" rel="author" class="text-xl font-bold text-white dark:text-white">{res.postBy && res.postBy.creator} {id}</a>
                                <p class="text-base text-gray-500 dark:text-gray-400">{res.postBy && res.postBy.status_creator}</p>
                                <p class="text-base text-gray-500 dark:text-gray-400"><time>{res.time_post}</time></p>
                            </div>
                        </div>
                    </address>
                    <h1 class="mb-4 text-3xl font-extrabold leading-tight text-white lg:mb-6 lg:text-4xl dark:text-white">{res.title}</h1>
                </header>
                {res.img_background ? <img src={res.img_background} alt={res.title} width={650} height={350} /> : <div className="skeleton h-32 w-32"></div>}
                {res.content && res.content.descriptions.map((r,i) => {
                  return(
                      <p key={i} className='text-white'>{r}</p>
                  )
                })}
                {res.content?.iframe_yt ? <iframe className='w-full aspect-video' src={res.content && res.content.iframe_yt} width={450} height={350} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> : <div className="skeleton h-32 w-32"></div>}
                <strong className='font-bold text-white'>{res.content && res.content.copyright}</strong>
            </article>
        </div>
      </div>
        </Suspense>
    </Layout>
  )
}
