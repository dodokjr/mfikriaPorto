import React from 'react'
import Benner from"../../assets/company/bennere.png"

export default function HeroSection() {
  return (
    <section className='px-5 pt-32 lg:px-4 lg:py-4'>
    <div className="font-sans max-w-6xl max-md:max-w-md mx-auto">
      <div className="grid md:grid-cols-2 items-center md:gap-8 gap-6">
        <div className="max-md:order-1 max-md:text-center z-50">
          <h2 className="text-gray-800 lg:text-6xl md:text-5xl text-3xl font-extrabold mb-4 md:!leading-[56px]"><span class="text-blue-600">Mfikria</span> <span className='text-white'>Business</span> <span class="text-blue-600">And</span> <span className='text-white'>Investment</span></h2>
          <p className="text-slate-300 mt-6 text-base leading-relaxed">This is a small business and investment page from Muhammad Fikri Ardiyansah, and here you can rent it to create a website and other programs. I also created an AI program and security program</p>

          <button type='button'
            className="mt-6 bg-blue-600 hover:bg-transparent hover:text-blue-600 border-2 border-blue-600 transition-all text-white font-semibold text-sm tracking-wide rounded-md px-6 py-2.5">Get Started</button>

          <div className="mt-12">
            <div className="grid sm:grid-cols-3 gap-4 items-center">
              <div className="flex flex-col items-center text-center">
                <h5 className="text-blue-500 font-bold text-xl mb-2">3+</h5>
                <p className="text-slate-200">Years Experience</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h5 className="text-blue-500 font-bold text-xl mb-2">1200+</h5>
                <p className="text-slate-200">Cases Solved</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h5 className="text-blue-500 font-bold text-xl mb-2">250</h5>
                <p className="text-slate-200">Business Partners</p>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex items-center relative max-md:before:hidden before:absolute">
          <img src={Benner} className="rounded-md lg:w-4/5 z-50 relative" alt="Dining Experience" />
        </div>
      </div>
    </div>
    </section>
  )
}
