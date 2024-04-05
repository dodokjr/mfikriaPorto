import React, {Suspense, useEffect, useState, use} from 'react'
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import htmlImg from "../../../assets/code/html.png"
import cssImg from "../../../assets/code/css.png"
import jsImg from "../../../assets/code/js.png"
import pyImg from "../../../assets/code/py.png"
import reactImg from "../../../assets/code/react.png"

const code = [
  {
    id: "01",
    title: "Html",
    img_src: htmlImg,
    progress: 100,
    project_code_progress: 100,
},
{
    id: "02",
    title: "Javascript",
    img_src: jsImg,
    progress: 80,
    project_code_progress: 95,
},
{
    id: "03",
    title: "CSS",
    img_src: cssImg,
    progress: 100,
    project_code_progress: 100,
},
{
    id: "04",
    title: "React Javascript",
    img_src: reactImg,
    progress: 85,
    project_code_progress: 80,
},
{
    id: "05",
    title: "Python",
    img_src: pyImg,
    progress: 40,
    project_code_progress: 10,
}
]

export default function CardCode() {
  return (
    <div className='p-4'>
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 px-4">
      {code.map((r,i) => {
    return(
      <div  className='card border border-spacing-2 rounded-md scale-up-center' key={r.id}>
    <p className='card-title justify-center'>{r.title}</p>
    <div className='card-body'>
      <img src={r.img_src} alt='...' className=''/>
      <p>Skill Progress <span className="text-Violet-900 font-bold">{r.progress} %</span></p>
      <progress className="progress progress-error w-30" value={r.progress} max="100"></progress>
      <p>Skill project Progress <span className="text-Violet-900 font-bold">{r.project_code_progress} %</span></p>
      <progress className="progress progress-error w-30" value={r.project_code_progress} max="100"></progress>
    </div>
  </div>
    )
  })}
      </div>
    </div>
  )
}
