import { useEffect, useState } from 'react'
import '../assets/App.css'
import Layout from './layout';
import HomeStore from './components/store/homeStore.jsx'

export default function Store(){
    const [data, setData] = useState([])

    useEffect(() => {
        api()
      }, [])
    
    const api = async () => {
        const assetsP = await fetch('https://api-mfikria.vercel.app/mfikria/store/assets')
        const product = await assetsP.json()
        setData(product)
    }

    if(data){
        console.log(data.data)
    } else {
        console.error("data tidak ada/error")
    }

    return(
        <>
        <HomeStore products={data.data}/>
        </>
    )
}

