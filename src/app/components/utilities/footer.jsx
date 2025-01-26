import { useEffect, useState } from "react";
import { FaArrowAltCircleUp } from "react-icons/fa";

const Footer = () => {
    const isBrowser = () => typeof window !== 'undefined';
    const scrollToTop = () => {
        if(!isBrowser()) return;
        window.scrollTo({
            top:0,
            behavior: "smooth"
        })
    }
    let date = new Date();
    let year = date.getFullYear();
    return(
        <footer className="bg-color-accent rounded-lg shadow m-4 text-color-primary text-white">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href={"/"}>Mfikria </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
                        <li className="items-end">
                        <button onClick={scrollToTop} className="relative inline-flex items-center justify-center p-4 overflow-hidden font-medium transition duration-300 ease-out rounded-full shadow-md group">
<span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-pink-500 group-hover:translate-x-0 ease">
<FaArrowAltCircleUp size={22}/>
</span>
<span className="absolute flex items-center justify-center w-full h-full text-pink-500 transition-all duration-300 transform group-hover:translate-x-full ease">Up</span>
<span className="relative invisible">Up</span>
</button>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-color-blue sm:mx-auto lg:my-2"/>
               <div className="sm:flex sm:items-center sm:justify-between">
                 <span className="block text-sm text-color-primary sm:text-center">Copyright © {year} Mfikria</span>
             </div>
            </div>
        </footer>
    )
}

export default Footer