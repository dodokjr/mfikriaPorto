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
              <p className="text-sm text-gray-300"><div className="status status-error animate-ping"></div>Server Uptime</p>
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}
