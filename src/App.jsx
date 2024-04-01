import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useParams } from 'react-router-dom';


function App() {
const {id, name} = useParams()
  return (
    <>
      <div className='flex justify-center text-bold text-2xl'>Hello: {id} your name is :{name}</div>
    </>
  )
}

export default App
