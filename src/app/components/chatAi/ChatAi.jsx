import React, { useEffect, useState } from 'react'
import ChatPromt from './ChatPromt'

export default function ChatAi() {
    const [name, setName] = useState()
    const [localName, setLocalName]= useState()
    const localstoreGet = localStorage.getItem("chatAiName")

    const addLocalStore = () => {
        localStorage.setItem("chatAiName", name)
        window.location.reload();
    }

    if(!localstoreGet) {
        return(
            <form onSubmit={addLocalStore} className='h-screen flex items-center'>
            <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] p-6 w-full max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
      <h3 className="text-xl font-bold text-gray-800">Heading</h3>
      <p className="mt-3 text-sm text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor.</p>

      <div className="relative flex items-center px-1 bg-gray-50 border-2 focus-within:border-[#007bff] focus-within:bg-white rounded-lg mt-6">
        <input type="text" placeholder="Enter Your Name"
value={name}
onChange={(e) => setName(e.target.value)}
required
          className="p-3 text-gray-800 w-full text-sm bg-transparent outline-none" />
        <button type="button"
        onClick={addLocalStore}
          className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700">Send</button>
      </div>
            </div>
            </form>
        )
    } else {
        return (
            <ChatPromt name={localstoreGet}/>
          )
    }
}
