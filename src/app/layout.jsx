import React, {useEffect, useState} from 'react'
import Navbar from './components/utilities/navbar'
import Footer from './components/utilities/footer'
import Preload from './pre'

export default function Layout({children}) {
  const [load, setLoad] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <Preload load={load}/>
    <div id={load ? "no-scroll" : "scroll"}>
      <Navbar />
        {children}
        <Footer/>
    </div>
    </>
  )
}
