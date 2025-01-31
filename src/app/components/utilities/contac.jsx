import React,{useEffect, useState, useRef} from 'react'
import emailjs from'@emailjs/browser'
import { FaLocationDot,FaPhone,FaXTwitter,FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { BiErrorAlt } from "react-icons/bi";


export default function Contac({api}) {
    const inputValue = useRef()
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const [notif, setNotif] = useState(false);
    const [errNotif, setErrNotif] = useState(false);
    const formRef = useRef();

    const handleValidation = () => {
        const formFields = {...fields};
        const formErrors = {};
        let formIsValid = true;

        // name
      if(!formFields["name"]){
        formIsValid = false;
        formErrors["name"] = "Cannot be empty";  
      }

      if(typeof formFields["name"] !== "undefined") {
        if(!formFields["name"].match(/^[a-zA-Z]+$/)) {
            formIsValid = false;
            formErrors["email"] = "Only letters"
        }
      }

        //email

        if(!formFields["email"]){
            formIsValid = false;
            formErrors["email"] = "Cannot be empty";  
          }

          if(typeof formFields["email"] !== "undefined"){
            let lastAtPos = formFields["email"].lastIndexOf('@');
            let lastDotPos = formFields["email"].lastIndexOf('.');
      
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && formFields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
              formIsValid = false;
              formFields["email"] = "Email is not valid";
            }
          }
          
        //message
        
        if(!formFields["message"]){
            formIsValid = false;
            formErrors["message"] = "Cannot be empty";  
        }
        setErrors(formErrors)
        return formIsValid;
    }
    
    const handleChange = (field, value) => {
        setFields({
          ...fields,
          [field]: value
        })
      }

    const handleSubmit = (e) =>
    {
      const keyword = inputValue.current.value;
      if(e.key == 'Enter' || e.type === 'click'){
        e.preventDefault();
        if(handleValidation()) {
            emailjs
          .sendForm(
            'service_19cu8fs',
            'template_aggqz48',
            formRef.current,
            'tVJhXv51XVHIQind4'
          )
          .then(
            (result) =>
            {
              setNotif(true)
            },
            (Error) => {
                setErrNotif(true)
            }
          ); 
        } 
      }
    };
  return ( 
    <section className="min-h-screen bg-cover " style={{backgroundImage: `url('https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')`}}>
    <div className="flex flex-col min-h-screen bg-black/60">
        <div className="container flex flex-col flex-1 px-6 py-12 mx-auto">
            <div className="flex-1 lg:flex lg:items-center lg:-mx-6">
            <div className="text-white lg:w-1/2 lg:mx-6">
                <h1 className="text-2xl font-semibold capitalize lg:text-3xl">Get a quote</h1>

                <p className="max-w-xl mt-6">Ask us everything and we would love to hear from you</p>

                <div className="mt-6 space-y-8 md:mt-8">
                    <p className="flex items-start -mx-2">
                        <FaLocationDot size={19} className='w-6 h-6 mx-2 text-white'/>
                        <span className="mx-2 text-white truncate w-72">
                            Sendang Mulyo Tembalang Semarang City, Central Of Java. 50272 
                        </span>
                    </p>

                    <p className="flex items-start -mx-2">
                        <FaPhone size={19} className='w-6 h-6 mx-2 text-white'/>
                        <span class="mx-2 text-white truncate w-72">(+62) 8572-7738-629</span>
                    </p>

                    <p class="flex items-start -mx-2">
                        <IoMail size={19} className='w-6 h-6 mx-2 text-white'/>
                        <a href='mailto:ffikri604@gmail.com'><span class="mx-2 text-white truncate w-72">ffikri604@gmail.com</span></a>
                    </p>
                </div>

                <div class="mt-6 md:mt-8">
                    <h3 class="text-gray-300 ">Follow us</h3>

                    <div class="flex mt-4 -mx-1.5">
                        <a href="https://x.com/bintangFikri3" target='_blank' class="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500">
                            <FaXTwitter size={22} className='fill-current'/>
                        </a>

                        <a href="https://www.linkedin.com/in/muhammad-fikri-ardiyansah-952752194/" target='_blank' class="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500">
                            <FaLinkedinIn size={22} className='fill-current'/>
                        </a>

                        <a href='https://fb.com/muhammad.f.ardiyansah.16/' target='_blank' class="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500">
                            <FaFacebookF size={22} className='fill-current'/>
                        </a>

                        <a href="https://www.instagram.com/fkri__17?hl=en" target='_blank' class="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500">
                            <FaInstagram size={22} className='fill-current'/>
                        </a>
                    </div>
                </div>
            </div>

{/* Contac form */}
                <div className="mt-8 lg:w-1/2 lg:mx-6">
                    <div className="w-full px-8 py-10 mx-auto overflow-hidden bg-white shadow-2xl rounded-xl dark:bg-gray-900 lg:max-w-xl">
                        <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Contact form</h1>

                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Ask us everything and we would love
                            to hear from you
                        </p>


{notif && <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
    <div className="flex items-center justify-center w-12 bg-emerald-500">
        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
        </svg>
    </div>
    <div className="px-4 py-2 -mx-3">
        <div className="mx-3">
            <span className="font-semibold text-emerald-500 dark:text-emerald-400">Success</span>
            <p className="text-sm text-gray-600 dark:text-gray-200">Your Message has been sent!!</p>
        </div>
    </div>
</div>
 ||  errNotif && <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-center w-12 bg-red-500">
            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
            </svg>
        </div>
    
        <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
                <span className="font-semibold text-red-500 dark:text-red-400">Error</span>
                <p className="text-sm text-gray-600 dark:text-gray-200">
                your message was not sent!!
                </p>
            </div>
        </div>
    </div>}
                        <form className="mt-6" ref={formRef} onSubmit={handleSubmit}>
                        <div className="flex-1">
                            <label className="form-control w-full max-w-xs">
                            <div className="label">
                            <span className="label-text">What is your name?</span>
                            <span className="label-text-alt text-red-500">{errors["name"]}</span>
                            </div>
                            <input type="name" name='name' onChange={e => handleChange('name', e.target.value)} value={fields["name"]} ref={inputValue} onKeyDown={handleSubmit} placeholder="John Doe" class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" required />
                            </label>
                        </div>

                        <div className="flex-1 mt-6">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                            <span className="label-text">Email address</span>
                            <span className="label-text-alt text-red-500">{errors["email"]}</span>
                            </div>
                            <input type="email" name='email' onChange={e => handleChange('email', e.target.value)} value={fields["email"]} ref={inputValue} onKeyDown={handleSubmit} placeholder="johndoe@example.com" class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" required/>
                        </label>
                        </div>

                            <div className="w-full mt-6">
                            <label className="form-control w-full max-w-xs">
                            <div className="label">
                            <span className="label-text">Message</span>
                            <span className="label-text-alt text-red-500">{errors["message"]}</span>
                            </div>
                            <textarea name="message" onChange={e => handleChange('message', e.target.value)} value={fields["message"]} className="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-48 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" ref={inputValue} onKeyDown={handleSubmit} placeholder="Message" required></textarea>
                        </label>
                        </div>

                        <div className='flex mt-6'>
                        <button onClick={handleSubmit} className="dark:text-white text-slate-800 p-2 relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 group">
                            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Send</span>
                        </button>
                        </div>
                        </form>
                        <div className='p-2 flex justify-center'>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
  )
}
