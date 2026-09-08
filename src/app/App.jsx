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

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("https://api-mfikria.vercel.app/v1/home")
      .then((res) => res.json())
      .then((body) => {
        if (isMounted) {
          setData(body);
          setIsLoading(false);
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
      <main className="bg-gray-950 min-h-screen text-white">
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
