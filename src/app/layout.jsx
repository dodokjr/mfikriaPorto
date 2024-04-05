import React from 'react'
import Navbar from './components/utilities/navbar'
import Footer from './components/utilities/footer'

export default function Layout({children}) {
  return (
    <main>
        <Navbar />
        {children}
        <Footer/>
    </main>
  )
}
