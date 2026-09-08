import React from 'react';

// Data disentralisasi agar mudah ditambah/diubah
const TIMELINE_DATA = [
  {
    year: '2017',
    title: 'Elementary School',
    description: 'In elementary school, I started to study the basic fields of education.',
  },
  {
    year: '2021',
    title: 'Junior High School',
    description: 'In junior high school, I discovered my interest in tech through video games in internet cafes.',
  },
  {
    year: '2024',
    title: 'Senior High School',
    description: 'Found my passion for game development and studied autodidactically to hone my skills.',
  },
  {
    year: '2024 - Present',
    title: 'Freelance Frontend Developer',
    description: 'Currently working as a frontend developer, building modern and integrated web applications.',
  },
];

// Komponen ikon SVG terpisah agar tidak diulang
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

export default function TimeLine() {
  return (
    <div className="flex justify-center p-4 text-white">
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical max-w-4xl">
        {TIMELINE_DATA.map((item, index) => {
          const isEven = index % 2 === 0;
          const isLast = index === TIMELINE_DATA.length - 1;

          return (
            <li key={index}>
              {index !== 0 && <hr className="bg-pink-500" />}
              
              <div className="timeline-middle">
                <CheckIcon />
              </div>

              <div className={`${isEven ? 'timeline-start md:text-end' : 'timeline-end'} mb-10`}>
                <time className="font-mono text-sm italic opacity-80">{item.year}</time>
                <div className="text-lg font-black">{item.title}</div>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>

              {!isLast && <hr className="bg-pink-500" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}