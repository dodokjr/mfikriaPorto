import { useEffect, useState } from 'react'
import '../assets/App.css'
import Layout from './layout';
import HomeStore from './components/store/homeStore.jsx'
import Alert from './components/utilities/Alert'

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
        "Data berhasil di dapat"
    } else {
        return(
            <Alert variant="error" title="Gagal Menyimpan" dismissible>
                Koneksi server terputus. Silakan coba beberapa saat lagi.
            </Alert>
        )
    }

    return(
        <>
        <HomeStore products={data.data}/>
        </>
    )
}

