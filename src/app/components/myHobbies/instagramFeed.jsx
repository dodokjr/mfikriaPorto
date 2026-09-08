import React, { useState } from 'react'

export default function InstagramFeed({ api }) {
  const [loadingMap, setLoadingMap] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalImageLoaded, setModalImageLoaded] = useState(false)

  if (!api || !Array.isArray(api)) {
    return (
      <section className="bg-gray-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block skeleton h-6 w-28 rounded-full mb-3 bg-gray-800"></div>
            <div className="mx-auto skeleton h-8 w-48 rounded-lg mb-2 bg-gray-800"></div>
            <div className="mx-auto skeleton h-4 w-64 rounded-lg bg-gray-800"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="skeleton h-64 w-full bg-gray-800 animate-pulse"></div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="skeleton h-3 w-20 rounded bg-gray-800"></div>
                  <div className="skeleton h-5 w-32 rounded bg-gray-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const handleImageLoad = (index) => {
    setLoadingMap((prev) => ({ ...prev, [index]: true }))
  }

  const handleOpenModal = (r) => {
    setModalImageLoaded(false)
    setSelectedImage(r)
  }

  return (
    <section className="bg-gray-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            Galeri Sosial
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Instagram Feed
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Klik pada gambar untuk melihat tampilan penuh (full screen) dengan efek pemuatan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {api.map((r, i) => (
            <div
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 transition-all duration-300 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/5"
            >
              <div 
                className="relative h-64 w-full overflow-hidden bg-gray-800 cursor-pointer"
                onClick={() => handleOpenModal(r)}
              >
                {!loadingMap[i] && (
                  <div className="absolute inset-0 skeleton w-full h-full bg-gray-800 animate-pulse z-10"></div>
                )}
                
                <img
                  alt={r.caption || "Instagram Feed Post"}
                  src={r.url_Image}
                  onLoad={() => handleImageLoad(i)}
                  className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${
                    loadingMap[i] ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900/80 border border-gray-700 rounded-full backdrop-blur-md">
                    Full Screen
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-grow p-5 justify-between">
                <div>
                  <a href={r.url_Profile || "#"} target="_blank" rel="noopener noreferrer">
                    <p className="text-xs font-semibold tracking-wider text-pink-400 mb-1 hover:text-pink-300 transition-colors">
                      @fkri__17
                    </p>
                    <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 hover:text-pink-400 transition-colors">
                      {r.name || "M Fikri A"}
                    </h3>
                  </a>
                </div>

                {r.caption && (
                  <p className="mt-2 text-xs text-gray-400 line-clamp-2">
                    {r.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Full Screen dengan Efek Skeleton */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div 
              className="relative w-full h-full flex flex-col items-center justify-center max-w-7xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-grow w-full h-full flex items-center justify-center overflow-hidden py-10">
                
                {/* Efek Skeleton / Loading pada Modal */}
                {!modalImageLoaded && (
                  <div className="absolute inset-10 skeleton w-auto h-auto bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium tracking-wider">Memuat gambar...</span>
                  </div>
                )}

                <img
                  src={selectedImage.url_Image}
                  alt={selectedImage.caption || "Full Screen Image"}
                  onLoad={() => setModalImageLoaded(true)}
                  className={`max-h-[85vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                    modalImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              <div className="w-full text-center pb-2">
                <p className="text-sm font-medium text-white">{selectedImage.caption || selectedImage.name || "M Fikri A"}</p>
                {selectedImage.url_Profile && (
                  <a
                    href={selectedImage.url_Profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    Kunjungi Profil Instagram &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}