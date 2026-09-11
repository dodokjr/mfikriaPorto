import { useEffect, useState } from 'react';
import '../assets/App.css';
import Layout from './layout';
import Home from './components/home/home';
import TimeLine from './components/home/timeLine';
import HomeProject from './components/project/homeProject';
import BlogHome from './components/blog/blogHome';
import Contac from './components/utilities/contac';
import Loading from './components/utilities/Loading';
import SectionStar from './components/home/SectionStar';
import Benner from './components/utilities/Benner.jsx';
import { IoReload } from 'react-icons/io5';
import { HiSparkles, HiX } from 'react-icons/hi';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("https://api-mfikria.vercel.app/v1/home")
      .then((res) => res.json())
      .then((body) => {
        if (isMounted) {
          setData(body);
          setIsLoading(false);
          
          const hasVisited = sessionStorage.getItem('hasVisited_mfikria');
          if (!hasVisited) {
            setShowWelcome(true);
            sessionStorage.setItem('hasVisited_mfikria', 'true');
          }
        }
      })
      .catch((error) => {
        console.error("API not responding, please call me: ffikri604@gmail.com", error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <main className="bg-gray-950 min-h-screen text-white relative">
        {/* Welcome Notification Banner dari Atas */}
        <div className={`fixed top-5 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-out pointer-events-none ${
          showWelcome ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
        }`}>
          <div className="pointer-events-auto bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 max-w-lg w-full shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-lg shrink-0">
                <HiSparkles />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight text-white">Selamat Datang di Website Saya!</h4>
                <p className="text-xs text-gray-400">
                  Halo! Terima kasih telah berkunjung ke portofolio <span className="text-cyan-400 font-medium">mfikria</span>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-8 h-8 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Banner Minimalis / Pengganti Diff Lama */}
        <Benner/>

        {/* Komponen Konten Utama */}
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
          <Home data={data} />
          <TimeLine />
          <HomeProject api={data} />
          <SectionStar />
          <BlogHome api={data} />
          <Contac api={data} />
        </div>
      </main>
    </Layout>
  );
}

export default App;