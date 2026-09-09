import { useRef, useState, useEffect } from 'react';
import { MdSkipPrevious } from "react-icons/md";
import { IoPlaySkipForward, IoPlaySharp, IoPause, IoReload, IoVolumeHigh, IoVolumeMute, IoShuffle, IoRepeat } from "react-icons/io5";

export default function Music() {
  const musicAPI = [
    {
      songName: 'ONLY',
      songArtist: 'Lee Hi',
      songSrc: 'https://mfikria-2021.netlify.app/assets/03.ONLY%20-%20Lee%20Hi%20(Melisa%20Hart%20ft.%20Roomate%20Project%20Cover)%20Live%20Session.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    },
    {
      songName: 'Wanita Masih Banyak',
      songArtist: 'Stand Hero Alone',
      songSrc: 'https://mfikria-2021.netlify.app/assets/10.Wanita%20Masih%20Banyak.mp3',
      songAvatar: 'https://mfikria-2021.netlify.app/assets/logo.png'
    },
    {
      songName: 'Cinta Itu Asu',
      songArtist: 'Unknown',
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
      songArtist: 'Kat',
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

  const [musicIndex, setMusicIndex] = useState(0)
  const [currentMusicDetails, setCurrentMusicDetails] = useState(musicAPI[0])
  const [audioProgress, setAudioProgress] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [musicTotalLength, setMusicTotalLength] = useState('00 : 00')
  const [musicCurrentTime, setMusicCurrentTime] = useState('00 : 00')
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [avatarClassIndex, setAvatarClassIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const [isShuffle, setIsShuffle] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  const playerRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0, isDragging: false, startX: 0, startY: 0 })

  const currentAudio = useRef(null)
  const avatarClass = ['object-cover', 'object-contain', 'rounded-none']

  useEffect(() => {
    const handleScroll = () => {
      // Diturunkan ke 100px agar lebih mudah muncul saat di-scroll ke bawah
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (currentAudio.current) {
      currentAudio.current.volume = volume
    }
  }, [])

  const handlePointerDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'INPUT') return
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)
    const clientY = e.clientY || (e.touches && e.touches[0].clientY)

    posRef.current.isDragging = true
    posRef.current.startX = clientX - posRef.current.x
    posRef.current.startY = clientY - posRef.current.y

    document.addEventListener('mousemove', handlePointerMove)
    document.addEventListener('mouseup', handlePointerUp)
    document.addEventListener('touchmove', handlePointerMove)
    document.addEventListener('touchend', handlePointerUp)
  }

  const handlePointerMove = (e) => {
    if (!posRef.current.isDragging) return
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)
    const clientY = e.clientY || (e.touches && e.touches[0].clientY)

    posRef.current.x = clientX - posRef.current.startX
    posRef.current.y = clientY - posRef.current.startY

    if (playerRef.current) {
      requestAnimationFrame(() => {
        playerRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
      })
    }
  }

  const handlePointerUp = () => {
    posRef.current.isDragging = false
    document.removeEventListener('mousemove', handlePointerMove)
    document.removeEventListener('mouseup', handlePointerUp)
    document.removeEventListener('touchmove', handlePointerMove)
    document.removeEventListener('touchend', handlePointerUp)
  }

  const handleAvatar = () => {
    setAvatarClassIndex((prev) => (prev >= avatarClass.length - 1 ? 0 : prev + 1))
  }

  const handleAudioPlay = () => {
    if (!currentAudio.current) return
    if (currentAudio.current.paused) {
      currentAudio.current.play().catch(() => {})
      setIsAudioPlaying(true)
    } else {
      currentAudio.current.pause()
      setIsAudioPlaying(false)
    }
  }

  const updateCurrentMusicDetails = (index) => {
    setIsLoading(true)
    setIsAudioPlaying(true) 
    const musicObject = musicAPI[index]
    setMusicIndex(index)
    setCurrentMusicDetails(musicObject)
    
    if (currentAudio.current) {
      currentAudio.current.pause()
      currentAudio.current.currentTime = 0
      currentAudio.current.src = musicObject.songSrc
      currentAudio.current.load()
      
      currentAudio.current.play().then(() => {
        setIsLoading(false)
      }).catch((err) => {
        console.log("Audio play error:", err)
        setIsLoading(false)
        setIsAudioPlaying(false)
      })
    }
  }

  const handleNextSong = () => {
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * musicAPI.length)
      while (randomIndex === musicIndex && musicAPI.length > 1) {
        randomIndex = Math.floor(Math.random() * musicAPI.length)
      }
      updateCurrentMusicDetails(randomIndex)
    } else {
      const nextIndex = musicIndex >= musicAPI.length - 1 ? 0 : musicIndex + 1
      updateCurrentMusicDetails(nextIndex)
    }
  }

  const handlePrevSong = () => {
    const prevIndex = musicIndex === 0 ? musicAPI.length - 1 : musicIndex - 1
    updateCurrentMusicDetails(prevIndex)
  }

  const handleSongEnded = () => {
    if (!isLooping) {
      handleNextSong()
    }
  }

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  const handleMusicProgressBar = (e) => {
    const value = e.target.value
    setAudioProgress(value)
    if (currentAudio.current && currentAudio.current.duration) {
      currentAudio.current.currentTime = (value * currentAudio.current.duration) / 100
    }
  }

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
    if (currentAudio.current) {
      currentAudio.current.volume = value
    }
    setIsMuted(value === 0)
  }

  const toggleMute = () => {
    if (currentAudio.current) {
      if (isMuted) {
        currentAudio.current.volume = volume || 0.5
        setIsMuted(false)
      } else {
        currentAudio.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleAudioUpdate = () => {
    if (!currentAudio.current) return
    const duration = currentAudio.current.duration
    const currentTime = currentAudio.current.currentTime

    if (!isNaN(duration)) {
      const minTotal = Math.floor(duration / 60)
      const secTotal = Math.floor(duration % 60)
      setMusicTotalLength(`${minTotal < 10 ? `0${minTotal}` : minTotal} : ${secTotal < 10 ? `0${secTotal}` : secTotal}`)
    }

    if (!isNaN(currentTime)) {
      const minCurrent = Math.floor(currentTime / 60)
      const secCurrent = Math.floor(currentTime % 60)
      setMusicCurrentTime(`${minCurrent < 10 ? `0${minCurrent}` : minCurrent} : ${secCurrent < 10 ? `0${secCurrent}` : secCurrent}`)
      
      const progress = parseInt((currentTime / duration) * 100)
      setAudioProgress(isNaN(progress) ? 0 : progress)
    }
  }

  return (
    <>
      <audio 
        ref={currentAudio} 
        src={currentMusicDetails.songSrc} 
        loop={isLooping}
        onEnded={handleSongEnded} 
        onTimeUpdate={handleAudioUpdate}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
      />

      <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-6 flex justify-between items-center">
            <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              Music Distro
            </span>
            <div className="flex gap-2">
              <button 
                onClick={toggleShuffle} 
                className={`p-2 rounded-full border transition-colors ${isShuffle ? 'bg-pink-600 border-pink-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                title="Acak Lagu"
              >
                <IoShuffle size={16} />
              </button>
              <button 
                onClick={toggleLoop} 
                className={`p-2 rounded-full border transition-colors ${isLooping ? 'bg-pink-600 border-pink-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                title="Ulangi Lagu"
              >
                <IoRepeat size={16} />
              </button>
            </div>
          </div>

          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-8 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700/60 shadow-lg cursor-pointer group" onClick={handleAvatar}>
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <IoReload className="w-8 h-8 text-pink-500 animate-spin" />
                <span className="text-xs font-medium text-gray-300">Memuat lagu...</span>
              </div>
            )}
            <img 
              src={currentMusicDetails.songAvatar} 
              alt={currentMusicDetails.songName} 
              className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${avatarClass[avatarClassIndex]}`}
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-xl font-extrabold text-white truncate px-2">
              {currentMusicDetails.songName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-pink-400 truncate px-2">
              {currentMusicDetails.songArtist}
            </p>
          </div>

          <div className="mb-6">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={audioProgress} 
              onChange={handleMusicProgressBar} 
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
              <span>{musicCurrentTime}</span>
              <span>{musicTotalLength}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 px-1">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <IoVolumeMute size={20} /> : <IoVolumeHigh size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange} 
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all"
            />
            <span className="text-xs font-mono text-gray-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={handlePrevSong} className="p-3 rounded-full bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-white transition-colors">
              <MdSkipPrevious size={22} />
            </button>
            <button onClick={handleAudioPlay} disabled={isLoading} className="p-4 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50">
              {isAudioPlaying ? <IoPause size={24} /> : <IoPlaySharp size={24} />}
            </button>
            <button onClick={handleNextSong} className="p-3 rounded-full bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-white transition-colors">
              <IoPlaySkipForward size={22} />
            </button>
          </div>

        </div>
      </section>

      {/* Floating Mini Player (Akan muncul setelah di-scroll > 100px) */}
      <div 
        ref={playerRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className={`fixed bottom-4 right-4 z-50 cursor-grab active:cursor-grabbing select-none transition-opacity duration-300 ${
          isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 bg-gray-900/95 backdrop-blur-md border border-gray-800 p-3 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm w-full text-white">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <IoReload className="w-5 h-5 text-pink-500 animate-spin" />
              </div>
            )}
            <img src={currentMusicDetails.songAvatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="flex-grow min-w-0 pointer-events-none">
            <h4 className="text-xs font-bold text-white truncate">{currentMusicDetails.songName}</h4>
            <p className="text-[10px] text-pink-400 truncate">{currentMusicDetails.songArtist}</p>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-pink-500 h-full transition-all duration-200" style={{ width: `${audioProgress}%` }}></div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            <button onClick={handlePrevSong} className="p-1.5 text-gray-400 hover:text-white transition-colors hidden sm:block">
              <MdSkipPrevious size={18} />
            </button>
            <button onClick={handleAudioPlay} disabled={isLoading} className="p-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white transition-transform active:scale-95">
              {isAudioPlaying ? <IoPause size={16} /> : <IoPlaySharp size={16} />}
            </button>
            <button onClick={handleNextSong} className="p-1.5 text-gray-400 hover:text-white transition-colors">
              <IoPlaySkipForward size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}