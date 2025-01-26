import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SectionStar() {
    const navigate = useNavigate()
  return (
    <div className="bg-slate-900 px-8 py-16 font-sans">
      <div className="grid md:grid-cols-2 items-center gap-12 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">Startup Website Template</h1>
          <p className="mt-6 text-sm text-gray-300 leading-relaxed">I also got online projects in the form of mobile dev and website dev and received full stack developer projects.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-[#3e3e3e] flex flex-col items-center text-center rounded-md md:p-8 p-6">
            <h3 className="lg:text-5xl text-3xl font-extrabold text-blue-600">4.5</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-400">Total Users</p>
            </div>
          </div>
          <div className="bg-[#3e3e3e] flex flex-col items-center text-center rounded-md md:p-8 p-6">
            <h3 className="lg:text-5xl text-3xl font-extrabold text-blue-600">$1K</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-300">Revenue</p>
            </div>
          </div>
          <div className="bg-[#3e3e3e] flex flex-col items-center text-center rounded-md md:p-8 p-6">
            <h3 className="lg:text-5xl text-3xl font-extrabold text-blue-600">1K</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-300">Engagement</p>
            </div>
          </div>
          <div className="bg-[#3e3e3e] flex flex-col items-center text-center rounded-md md:p-8 p-6">
            <h3 className="lg:text-5xl text-3xl font-extrabold text-blue-600">99.9%</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-300">Server Uptime</p>
            </div>
          </div>
        </div> 
      </div>
      <br/>
      <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10">
      <img src="https://readymadeui.com/cardImg.webp" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover" />

      <div className="min-h-[350px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
        <h2 className="sm:text-4xl text-2xl font-bold mb-6">Explore the world of My business and Investment</h2>
        <p className="sm:text-lg text-base text-center text-gray-200">on this page I introduce my small business and investment in it, if you are interested in my life as a business please press the <b>Explore button</b>.</p>

        <button
          type="button"
          onClick={() => navigate("/company")}
          className="mt-12 bg-transparent text-white text-base py-3 px-6 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300">
          EXPROLER BUTTON
        </button>
      </div>
    </div>
    </div>
  )
}
