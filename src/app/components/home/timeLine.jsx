import {use} from "react" 

export default function TimeLine() {
  return (
    <div className='flex p-4 text-white'>
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
  <li>
    <div className="timeline-middle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-start md:text-end mb-10">
      <time className="font-mono italic">2017</time>
      <div className="text-lg font-black">Elementary School</div>
      In elementary school I started to study a basic field of education
    </div>
    <hr className="bg-pink-500"/>
  </li>
  <li>
    <hr className="bg-pink-500" />
    <div className="timeline-middle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-end mb-10">
      <time className="font-mono italic">2021</time>
      <div className="text-lg font-black">Junior High School</div>
      In junior high school I looked for my hobby through a video game in an internet cafe
    </div>
    <hr className="bg-pink-500"/>
  </li>
  <li>
    <hr className="bg-pink-500"/>
    <div className="timeline-middle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-start md:text-end mb-10">
      <time className="font-mono italic">2024</time>
      <div className="text-lg font-black">Senior High School</div>
      high school I found a passion that I admired to become a game developer and I studied autodidactically to practice my skills
    </div>
    <hr className="bg-pink-500"/>
  </li>
  <li>
    <hr className="bg-pink-500"/>
    <div className="timeline-middle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-end mb-10">
      <time className="font-mono italic">2024</time>
      <div className="text-lg font-black">Freelancer FrontEnd Developer</div>
      I am a frontend developer who is developing an integrated application.
    </div>
    <hr />
  </li>
</ul>
    </div>
  )
}
