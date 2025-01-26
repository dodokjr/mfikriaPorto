import React from 'react'

export default function Cproject() {
    const project = [
        {
            title: "Project Shop",
            img: "https://cdn.dribbble.com/users/3436034/screenshots/16972256/shopee.jpg",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas"
        },
        {
            title: "Project Machine Learning And AI",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSltE-7nc0jk0MrZRDqbc9ZjQZpM00StookPQ&s",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas"
        },
        {
            title: "Project Anti Virus",
            img: "https://wallpapers.com/images/hd/antivirus-oyjdwwma9av560rm.jpg",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas"
        },
        {
            title: "Project Mobile Dev",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDzXQ7-6NrjbYyooNrUvSTWClKTi4utL08FQ&s",
            deskipsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctorarcu,at fermentum dui. Maecenas"
        }
    ]
  return (
    <div className='font-[sans-serif] bg-slate-800'>
        <div class="max-w-2xl mx-auto text-left">
        <p class="text-sm font-bold text-blue-600 mb-4"><span class="rotate-90 inline-block mr-2">|</span> ALL MY PROJECT AND OLDER</p>
        <h2 class="text-white md:text-5xl text-3xl font-extrabold mb-4 md:!leading-[55px]">Project</h2>
        <p class="text-sm mt-6 leading-relaxed text-slate-500">Veniam proident aute magna anim excepteur et ex consectetur velit ullamco veniam minim aute sit. Elit occaecat officia et laboris Lorem minim. Officia do aliqua adipisicing ullamco in</p>
      </div>
         <div className='p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-xl:gap-4 gap-6'>
            {project.map((r,i) => {
                 return(
                    <div
      class="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-2xl font-[sans-serif] overflow-hidden mx-auto mt-4">
      <div class="min-h-[256px]">
        <img src={r.img} class="w-full rounded-2xl" />
      </div>

      <div class="p-6">
        <h3 class="text-2xl text-gray-800 font-extrabold">{r.title}</h3>

        <div class="mt-6 flex items-center">
          <h3 class="text-xl text-gray-800 font-bold flex-1">{r.deskipsi}</h3>
          <div class="bg-pink-100 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" class="fill-pink-600" viewBox="0 0 64 64">
              <path
                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                data-original="#000000"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
                 )
            })}
         </div>
    </div>
  )
}
