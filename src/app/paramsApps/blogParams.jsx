import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Layout from '../layout';

export default function BlogParams() {
    const { id } = useParams()
    const [res, setRes] = useState(null)
    const [imgLoaded, setImgLoaded] = useState(false)

    useEffect(() => {
        fetchData()
    }, [id])
    
    const fetchData = async () => {
        try {
            const api = await fetch(`https://api-mfikria.vercel.app/mfikria/c/blog/${id}`)
            const data = await api.json()
            setRes(data.data)
        } catch (error) {
            console.error("Gagal memuat detail blog:", error)
        }
    }

    if (!res) {
        return (
            <Layout>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="flex w-full max-w-2xl flex-col gap-6 p-6">
                        <div className="flex items-center gap-4">
                            <div className="skeleton h-14 w-14 rounded-full"></div>
                            <div className="flex flex-col gap-2">
                                <div className="skeleton h-4 w-32 rounded-md"></div>
                                <div className="skeleton h-3 w-20 rounded-md"></div>
                            </div>
                        </div>
                        <div className="skeleton h-10 w-3/4 rounded-lg"></div>
                        <div className="skeleton h-72 w-full rounded-2xl"></div>
                        <div className="flex flex-col gap-3">
                            <div className="skeleton h-4 w-full rounded-md"></div>
                            <div className="skeleton h-4 w-full rounded-md"></div>
                            <div className="skeleton h-4 w-2/3 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <main className="min-h-screen bg-gray-950 text-gray-100 py-12 md:py-20">
                <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Artikel */}
                    <header className="mb-8">
                        {res.postBy && (
                            <div className="flex items-center gap-4 mb-6">
                                <img 
                                    className="w-12 h-12 rounded-full object-cover border border-gray-800" 
                                    src={res.postBy.img_profile} 
                                    alt={res.postBy.creator || "Author"} 
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white">{res.postBy.creator}</span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <time className="text-xs text-gray-400">{res.time_post}</time>
                                    </div>
                                    <p className="text-xs text-pink-500 font-medium">{res.postBy.status_creator}</p>
                                </div>
                            </div>
                        )}

                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                            {res.title}
                        </h1>
                    </header>

                    {/* Gambar Utama dengan Skeleton */}
                    <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 mb-10">
                        {res.img_background ? (
                            <>
                                {!imgLoaded && (
                                    <div className="absolute inset-0 skeleton w-full h-full bg-gray-800 animate-pulse"></div>
                                )}
                                <img
                                    src={res.img_background}
                                    alt={res.title}
                                    onLoad={() => setImgLoaded(true)}
                                    className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                                />
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-600 text-sm">Tidak ada gambar</div>
                        )}
                    </div>

                    {/* Konten Paragraf */}
                    <div className="space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
                        {res.content?.descriptions && res.content.descriptions.map((r, i) => (
                            <p key={i} className="text-gray-300">
                                {r}
                            </p>
                        ))}
                    </div>

                    {/* Iframe YouTube Responsif */}
                    {res.content?.iframe_yt && (
                        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 aspect-video">
                            <iframe 
                                className="w-full h-full" 
                                src={res.content.iframe_yt} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    {/* Copyright / Footer Artikel */}
                    {res.content?.copyright && (
                        <div className="mt-12 pt-6 border-t border-gray-800/80 text-sm text-gray-500">
                            <span>{res.content.copyright}</span>
                        </div>
                    )}

                </article>
            </main>
        </Layout>
    )
}