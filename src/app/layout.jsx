import React, { useEffect, useState } from 'react';
import Navbar from './components/utilities/navbar';
import Footer from './components/utilities/footer';
import Preload from './pre';

export default function Layout({ children }) {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    // Mencegah scroll saat preloader aktif
    if (load) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const timer = setTimeout(() => {
      setLoad(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [load]);

  return (
    <>
      <Preload load={load} />
      
      <div className={`min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans antialiased transition-opacity duration-500 ${load ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}