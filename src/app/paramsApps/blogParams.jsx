import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../layout'

const API_URL = 'https://api-mfikria.vercel.app/v1/blog/post'

function BlogSkeleton() {
    return (
        <div className="mx-auto max-w-2xl animate-pulse px-5 py-16">
            <div className="mb-8 h-4 w-24 rounded bg-white/10" />
            <div className="mb-4 h-10 w-4/5 rounded-lg bg-white/10" />
            <div className="mb-10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10" />
                <div className="h-4 w-40 rounded bg-white/10" />
            </div>
            <div className="mb-10 aspect-[16/9] w-full rounded-2xl bg-white/10" />
            <div className="space-y-3">
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
        </div>
    )
}

export default function BlogParams() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [error, setError] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        setPost(null)
        setError(false)
        setImgLoaded(false)

        fetch(`${API_URL}/${id}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((json) => setPost(json.data))
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Gagal memuat detail blog:', err)
                    setError(true)
                }
            })

        return () => controller.abort()
    }, [id])

    if (error) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-neutral-950 px-5 text-center text-neutral-300">
                    <p>Artikel gagal dimuat.</p>
                    <Link to="/blog" className="text-sm text-pink-400 hover:underline">
                        ← Kembali ke blog
                    </Link>
                </div>
            </Layout>
        )
    }

    if (!post) {
        return (
            <Layout>
                <main className="min-h-screen bg-neutral-950">
                    <BlogSkeleton />
                </main>
            </Layout>
        )
    }

    const { postBy, content } = post

    return (
        <Layout>
            <main className="min-h-screen bg-neutral-950 text-neutral-200">
                <article className="mx-auto max-w-2xl px-5 py-16 md:py-24">
                    <Link
                        to="/blog"
                        className="mb-10 inline-block text-sm text-neutral-500 transition-colors hover:text-white"
                    >
                        ← Kembali
                    </Link>

                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                        {post.title}
                    </h1>

                    {postBy && (
                        <div className="mt-8 flex items-center gap-3">
                            <img
                                src={postBy.img_profile}
                                alt={postBy.creator || 'Author'}
                                className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                            />
                            <div className="text-sm leading-tight">
                                <p className="font-medium text-white">{postBy.creator}</p>
                                <p className="mt-0.5 text-neutral-500">
                                    {postBy.status_creator}
                                    {post.time_post && <> · <time>{post.time_post}</time></>}
                                </p>
                            </div>
                        </div>
                    )}

                    {post.img_background && (
                        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white/5">
                            {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-white/10" />}
                            <img
                                src={post.img_background}
                                alt={post.title}
                                onLoad={() => setImgLoaded(true)}
                                className={`h-full w-full object-cover transition-opacity duration-500 ${
                                    imgLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        </div>
                    )}

                    <div className="mt-10 space-y-6 text-[17px] leading-8 text-neutral-300">
                        {content?.descriptions?.map((text, i) => (
                            <p key={i}>{text}</p>
                        ))}
                    </div>

                    {content?.iframe_yt && (
                        <div className="mt-12 aspect-video overflow-hidden rounded-2xl bg-white/5">
                            <iframe
                                className="h-full w-full"
                                src={content.iframe_yt}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {content?.copyright && (
                        <p className="mt-16 border-t border-white/10 pt-6 text-sm text-neutral-500">
                            {content.copyright}
                        </p>
                    )}
                </article>
            </main>
        </Layout>
    )
}