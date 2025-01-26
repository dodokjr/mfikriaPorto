import React from 'react'

export default function Loading() {
  return (
    <div className='flex items-center justify-center content-center'>
    <div class="spinner-3 w-10 h-10 rounded-full bg-slate-100 relative">
        <div class="absolute w-full h-full bg-slate-100 rounded-full animate-ping"></div>
        <div class="absolute w-full h-full bg-slate-100 rounded-full animate-ping delay-200"></div>
      </div>
      <div className='text-white'>
        By <b>MFIKRIA</b>
      </div>
    </div>
  )
}
