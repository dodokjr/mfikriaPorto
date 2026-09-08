import React from 'react';
import LoadingAs from '../../../assets/documents/Mfikria.svg';

export default function Loading() {
  return (
    <div className="bg-gray-950 min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-gray-950 to-gray-950 pointer-events-none" />

      <div className="relative flex flex-col items-center justify-center p-8 bg-gray-900/40 backdrop-blur-xl border border-gray-800/80 rounded-3xl shadow-2xl z-10">
        
        {/* Animated Rings Container */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-500/40 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-2 border-indigo-500/30 border-t-transparent animate-[spin_3s_linear_infinite]" />
          
          {/* Logo / Avatar with Pulse */}
          <div className="relative w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-indigo-500 shadow-lg shadow-pink-500/20 animate-pulse">
            <img 
              src={LoadingAs} 
              alt="Loading" 
              className="w-full h-full object-cover rounded-full bg-gray-950" 
            />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-sm font-bold tracking-tight text-white mb-1">
          Memuat Sistem
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Mohon tunggu sebentar...
        </p>

      </div>
    </div>
  );
}