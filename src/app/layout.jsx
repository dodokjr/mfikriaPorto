import React, { useEffect, useState } from 'react';
import Navbar from './components/utilities/navbar';
import Footer from './components/utilities/footer';
import Preload from './pre';

export default function Layout({ children }) {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    // Mencegah scroll saat preloader aktif
    document.body.style.overflow = load ? 'hidden' : 'unset';

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

      <div
        className={`min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans antialiased transition-opacity duration-500 ${
          load ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Navbar />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 lg:py-24">
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}