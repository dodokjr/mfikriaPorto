import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const params = useLocation()
  const navigate = useNavigate()
  const [res, setRes] = useState([])
  useEffect(() => {
    if(params.pathname == "/") {
      navigate("/app")
    }
  });

  useEffect(() => {
    fetch(`https://api-mfikria.vercel.app/404${params.pathname}`)
    .then(res => res.json())
    .then(body => setRes(body))
    .catch(error => console.error("api not respons,plese call me: ffikri604@gmail.com"))
  }, [])

    
    return (
      <main className="grid min-h-full place-items-center bg-slate-100 px-3 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-red-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          What you mean by {params.pathname} doesn't exist
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/app?from=404"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
            <button className="btn text-sm font-semibold text-gray-900" onClick={()=>document.getElementById('my_modal_2').showModal()}>Contact support <span aria-hidden="true">&rarr;</span></button>
          </div>
        </div>

        {/* Dialog */}
        <dialog id="my_modal_2" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Hello, What you mean by {params.pathname} doesn't exist</h3>
    <p className="py-4">
      <div className="alert alert-error alert-outline">
      Time Status: {res.TimeStatus} And code for error: {res.code_for_message} please Email me For Fix Bug <a href='mailto:ffikri604@gmail.com' className='text-white'>ffikri604@gmail.com</a>
      </div>
    </p>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
      </main>
  )
}
