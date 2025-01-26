import React from 'react'
import { PiCertificateFill } from "react-icons/pi";

export default function CardSertifikat() {
    const sertifikat = [
        {
            title: "Python Certificate",
            img: "https://banner2.cleanpng.com/20180325/kpq/av0y5r3i9.webp",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas",
            byImg: "https://avatars.githubusercontent.com/u/22091590?s=280&v=4",
            byName: "DiCoding",
            byTag: "DICoding Academy"
        },
        {
            title: "Sertifikat Computer",
            img: "https://readymadeui.com/cardImg.webp",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas",
            byImg: "https://avatars.githubusercontent.com/u/22091590?s=280&v=4",
            byName: "DiCoding",
            byTag: "DICoding Academy"
        },
        {
            title: "Sertifikat Computer",
            img: "https://readymadeui.com/cardImg.webp",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas",
            byImg: "https://avatars.githubusercontent.com/u/22091590?s=280&v=4",
            byName: "DiCoding",
            byTag: "DICoding Academy"
        },
        {
            title: "Sertifikat Computer",
            img: "https://readymadeui.com/cardImg.webp",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas",
            byImg: "https://avatars.githubusercontent.com/u/22091590?s=280&v=4",
            byName: "DiCoding",
            byTag: "DICoding Academy"
        }
    ]
  return (
    <div className='font-[sans-serif] bg-slate-900'>
         <div class="max-w-2xl mx-auto text-center">
         <h2 class="text-white md:text-5xl text-3xl font-extrabold mb-4 md:!leading-[55px]">Certificate</h2>
        <p class="text-sm mt-6 leading-relaxed text-slate-500">Veniam proident aute magna anim excepteur et ex consectetur velit ullamco veniam minim aute sit. Elit occaecat officia et laboris Lorem minim. Officia do aliqua adipisicing ullamco in</p>
      </div>
         <div className='p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 max-xl:gap-4 gap-6'>
            {sertifikat.map((r,i) => {
                 return(
                    <div
                    className="bg-white grid sm:grid-cols-2 items-center shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-2xl max-sm:max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
                    <div className="min-h-[280px] h-full">
                      <img src={r.img} className="w-full h-full object-cover" />
                    </div>
              
                    <div className="p-6">
                      <h3 className="text-xl font-semibold">{r.title}</h3>
                      <p className="mt-3 text-sm text-gray-500 leading-relaxed">{r.deskipsi}</p>
              
                      <div className="flex flex-wrap items-center cursor-pointer border border-gray-300 rounded-lg w-full px-4 py-2 mt-6">
                        <img src={r.byImg} className="w-9 h-9 rounded-full" />
                        <div className="ml-4 flex-1">
                          <p className="text-sm text-gray-800 font-semibold">{r.byName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{r.byTag}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-gray-500" viewBox="0 0 32 32">
                          <path
                            d="M13 16c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3zm0 10c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3zm0-20c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3z"
                            data-original="#000000" />
                        </svg>
                      </div>
                    </div>
                  </div>
                 )
            })}
         </div>
    </div>
  )
}
