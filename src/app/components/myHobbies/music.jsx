import { useRef, useState } from 'react';
import { MdSkipPrevious } from "react-icons/md";
import { IoPlaySkipForward, IoPlaySharp, IoPause } from "react-icons/io5";
import "../../../assets/Music.css"

function Music() {

  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    songName: 'ONLY',
    songArtist: 'Lee Hi',
    songSrc: 'https://mfikria-2021.netlify.app/assets/03.ONLY%20-%20Lee%20Hi%20(Melisa%20Hart%20ft.%20Roomate%20Project%20Cover)%20Live%20Session.mp3',
    songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
  })

  //UseStates Variables
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const [musicTotalLength, setMusicTotalLength] = useState('04 : 38');
  const [musicCurrentTime, setMusicCurrentTime] = useState('00 : 00');
  const [videoIndex, setVideoIndex] = useState(0)

  const currentAudio = useRef()

  const handleMusicProgressBar = (e)=>{
    setAudioProgress(e.target.value);
    currentAudio.current.currentTime = e.target.value * currentAudio.current.duration / 100;
  }

  //Change Avatar Class
  let avatarClass = ['objectFitCover','objectFitContain','none']
  const [avatarClassIndex, setAvatarClassIndex] = useState(0)
  const handleAvatar = ()=>{
    if (avatarClassIndex >= avatarClass.length - 1) {
      setAvatarClassIndex(0)
    }else{
      setAvatarClassIndex(avatarClassIndex + 1)
    }
  }


  //Play Audio Function
  const handleAudioPlay = ()=>{
    if (currentAudio.current.paused) {
      currentAudio.current.play();
      setIsAudioPlaying(true)
    }else{
      currentAudio.current.pause();
      setIsAudioPlaying(false)
    }
  }

  const musicAPI = [
    {
      songName: 'ONLY',
      songArtist: 'Lee Hi',
      songSrc: 'https://mfikria-2021.netlify.app/assets/03.ONLY%20-%20Lee%20Hi%20(Melisa%20Hart%20ft.%20Roomate%20Project%20Cover)%20Live%20Session.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    },
    {
      songName: 'Wanita Masih Banyak ',
      songArtist: 'Stand Hero Alone',
      songSrc: 'https://mfikria-2021.netlify.app/assets/10.Wanita%20Masih%20Banyak.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    },
    {
      songName: 'Cinta Itu Asu',
      songArtist: 'none',
      songSrc: 'https://mfikria-2021.netlify.app/assets/05.Cinta%20Itu%20Asu.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    },
    {
      songName: 'Kita Lawan Mereka',
      songArtist: 'Stand Hero Alone',
      songSrc: 'https://mfikria-2021.netlify.app/assets/09.Kita%20Lawan%20Mereka.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    },
    {
      songName: 'Spesial',
      songArtist: 'kat',
      songSrc: 'https://mfikria-2021.netlify.app/assets/kat.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    },
    {
      songName: 'Aku Kamu dan Samudra',
      songArtist: 'Rebellion Rose',
      songSrc: 'https://mfikria-2021.netlify.app/assets/08.Rebellion%20Rose%20%20Aku%20Kamu%20dan%20Samudra%20Official%20Video%20Lirik.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    }
  ]

  const handleNextSong = ()=>{
    if (musicIndex >= musicAPI.length - 1) {
      let setNumber = 0;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }else{
      let setNumber = musicIndex + 1;
      setMusicIndex(setNumber)
      updateCurrentMusicDetails(setNumber);
    }
  }

  const handlePrevSong = ()=>{
    if (musicIndex === 0) {
      let setNumber = musicAPI.length - 1;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }else{
      let setNumber = musicIndex - 1;
      setMusicIndex(setNumber)
      updateCurrentMusicDetails(setNumber);
    }
  }

  const updateCurrentMusicDetails = (number)=>{
    let musicObject = musicAPI[number];
    currentAudio.current.src = musicObject.songSrc;
    currentAudio.current.play();
    setCurrentMusicDetails({
      songName: musicObject.songName,
      songArtist: musicObject.songArtist,
      songSrc: musicObject.songSrc,
      songAvatar: musicObject.songAvatar
    })
    setIsAudioPlaying(true);
  }

  const handleAudioUpdate = ()=>{
    //Input total length of the audio
    let minutes = Math.floor(currentAudio.current.duration / 60);
    let seconds = Math.floor(currentAudio.current.duration % 60);
    let musicTotalLength0 = `${minutes <10 ? `0${minutes}` : minutes} : ${seconds <10 ? `0${seconds}` : seconds}`;
    setMusicTotalLength(musicTotalLength0);

    //Input Music Current Time
    let currentMin = Math.floor(currentAudio.current.currentTime / 60);
    let currentSec = Math.floor(currentAudio.current.currentTime % 60);
    let musicCurrentT = `${currentMin <10 ? `0${currentMin}` : currentMin} : ${currentSec <10 ? `0${currentSec}` : currentSec}`;
    setMusicCurrentTime(musicCurrentT);

    const progress = parseInt((currentAudio.current.currentTime / currentAudio.current.duration) * 100);
    setAudioProgress(isNaN(progress)? 0 : progress)
  }


  const vidArray = ['https://mfikria-2021.netlify.app/assets/Aesthetic%20anime%20cooking%20ramen%20with%20sound%20effects.mp4'];

  const handleChangeBackground = ()=>{
    if (videoIndex >= vidArray.length - 1) {
      setVideoIndex(0);
    }else{
      setVideoIndex(videoIndex + 1)
    }
  }


  return (
    <>
    <div className="overflow-hidden flex justify-center p-2 text-white">
      <audio src='./Assets/songs/Chasing - NEFFEX.mp3' ref={currentAudio} onEnded={handleNextSong} onTimeUpdate={handleAudioUpdate}></audio>
      <div className="blackScreen"></div>
      <div className="music-Container">
        <p className='musicPlayer'>Music Player</p>
        <p className='music-Head-Name'>{currentMusicDetails.songName}</p>
        <p className='music-Artist-Name'>{currentMusicDetails.songArtist}</p>
        <img src={currentMusicDetails.songAvatar} className={avatarClass[avatarClassIndex]} onClick={handleAvatar} alt="song Avatar" id='songAvatar'/>
        <div className="musicTimerDiv">
          <p className='musicCurrentTime'>{musicCurrentTime}</p>
          <p className='musicTotalLenght'>{musicTotalLength}</p>
        </div>
        <input type="range" name="musicProgressBar" className="range range-sm range-error" value={audioProgress} onChange={handleMusicProgressBar} />
        <div className="flex justify-center">
          <MdSkipPrevious size={25} onClick={handlePrevSong}/>
          {isAudioPlaying ? <IoPause size={20} onClick={handleAudioPlay}/> : <IoPlaySharp size={20} onClick={handleAudioPlay}/> }
          <IoPlaySkipForward size={20} onClick={handleNextSong}/>
        </div>
      </div>
    </div>
    </>
  );
}

export default Music;