import React from 'react'
import Header from '../utilities/header'

export default function HomeProject({api}) {
  return (
    <div className='p-4'>
        <Header title={"My Project"} urlTitle={"Lihat Semua"} url={"/project"}/>
        <div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 px-4'>
            {api.data.project.map((r,i) => {
                return(
                    <div className='card border border-spacing-2 rounded-md scale-up-center' key={r.id}>
                <div className='card-body'>
                    <img src={r.img_url} className='rounded-md'/>
                <div className='card-title justify-center'>{r.title}</div>
                    <div className='font-bold'>{r.descriptions}</div>
                    <div className='p-1'>
                            <p>{r.code.name_html} <span className="text-Violet-900 font-bold">{r.code.skillHtml} %</span></p>
                            <progress className="progress progress-error w-30" value={r.code.skillHtml} max="100"></progress>
                            <p>{r.code.name_css} <span className="text-Violet-900 font-bold">{r.code.skillCss} %</span></p>
                            <progress className="progress progress-error w-30" value="30" max="100"></progress>
                            <p>{r.code.name_js} <span className="text-Violet-900 font-bold">{r.code.skillJs} %</span></p>
                            <progress className="progress progress-error w-30" value="30" max="100"></progress>
                    </div>
                    <div className='p-1 justify-center items-center grid grid-cols-4 gap-2'>
                        <a href={r.url_github} target='_blank'>Github</a>
                        <a href={r.url_demo} target='_blank'>Url</a>
                    </div>
                </div>
            </div>
                )
            })}
        </div>
    </div>
  )
}
