import React from 'react'
import Cnavbar from './components/utilities/Cnavbar'
import HeroSection from './components/utilities/HeroSection'
import Feature from './components/utilities/Feature'
import AboutAs from './components/utilities/AboutAs'
import CardSertifikat from './components/utilities/CardSertifikat'
import Cproject from './components/utilities/Cproject'
import Testimoni from './components/utilities/Testimoni'
import Contac from '../utilities/contac'
import Footer from '../utilities/footer'

export default function Capps() {
  return (
    <>
    <Cnavbar/>
    <div className='lg:pt-36'>
    <HeroSection/>
    <AboutAs/>
    <Feature/>
    <CardSertifikat/>
    <Cproject/>
    <Testimoni/>
    <Contac/>
    </div>
    <Footer/>
    </>
  )
}
