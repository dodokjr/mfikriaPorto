import { useEffect, useState } from "react";
import { FaGithub, FaInstagram } from "react-icons/fa6";

const Footer = () => {
    let date = new Date();
    let year = date.getFullYear();
    return(
        <footer className="bg-color-accent rounded-lg shadow m-4 text-color-primary">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href={"/"}>Mfikria </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
                        <li>
                            <a href="#" className="hover:underline hover:text-color-gray me-4 md:me-6">Link</a>
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