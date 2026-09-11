import { useRef, useState, useEffect } from 'react';
import { MdSkipPrevious } from "react-icons/md";
import { IoPlaySkipForward, IoPlaySharp, IoPause, IoReload, IoVolumeHigh, IoVolumeMute, IoShuffle, IoRepeat, IoMusicalNotes } from "react-icons/io5";

export default function Music() {
  const [musicAPI, setMusicAPI] = useState([])
  const [isFetchingList, setIsFetchingList] = useState(true)

  const [musicIndex, setMusicIndex] = useState(0)
  const [currentMusicDetails, setCurrentMusicDetails] = useState(null)
  const [audioProgress, setAudioProgress] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [musicTotalLength, setMusicTotalLength] = useState('00 : 00')
  const [musicCurrentTime, setMusicCurrentTime] = useState('00 : 00')
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [avatarClassIndex, setAvatarClassIndex] = useState(0)

  const [isShuffle, setIsShuffle] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  const playerRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0, isDragging: false, startX: 0, startY: 0 })

  const currentAudio = useRef(null)
  const avatarClass = ['object-cover', 'object-contain', 'rounded-none']

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setIsFetchingList(true)
        const response = await fetch('https://api-mfikria.vercel.app/mfikria/myhobbies/music')
        const data = await response.json()

        if (data && data.assets_data && Array.isArray(data.assets_data.music) && data.assets_data.music.length > 0) {
          setMusicAPI(data.assets_data.music)
          setCurrentMusicDetails(data.assets_data.music[0])
        }
      } catch (error) {
        console.error("Gagal mengambil data lagu dari API:", error)
      } finally {
        setIsFetchingList(false)
      }
    }

    fetchMusic()
  }, [])

  useEffect(() => {
    if (currentAudio.current) {
      currentAudio.current.volume = volume
    }
  }, [volume])

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
      currentAudio.current.play().then(() => {
        setIsAudioPlaying(true)
      }).catch((err) => {
        console.error("Audio play error:", err)
        setIsAudioPlaying(false)
      })
    } else {
      currentAudio.current.pause()
      setIsAudioPlaying(false)
    }
  }

  const updateCurrentMusicDetails = (index) => {
    if (!musicAPI[index]) return
    const musicObject = musicAPI[index]
    
    setMusicIndex(index)
    setCurrentMusicDetails(musicObject)
    setIsLoading(true)
    setIsAudioPlaying(true)

    if (currentAudio.current) {
      currentAudio.current.src = musicObject.songSrc
      currentAudio.current.currentTime = 0
      
      currentAudio.current.play().then(() => {
        setIsLoading(false)
      }).catch((err) => {
        console.error("Audio play error:", err)
        setIsLoading(false)
        setIsAudioPlaying(false)
      })
    }
  }

  const handleNextSong = () => {
    if (musicAPI.length === 0) return
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
    if (musicAPI.length === 0) return
    const prevIndex = musicIndex === 0 ? musicAPI.length - 1 : musicIndex - 1
    updateCurrentMusicDetails(prevIndex)
  }

  const handleSongEnded = () => {
    if (!isLooping) {
      handleNextSong()
    }
  }

  const toggleShuffle = () => setIsShuffle(!isShuffle)
  const toggleLoop = () => setIsLooping(!isLooping)

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

  if (isFetchingList) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <IoReload className="w-10 h-10 text-pink-500 animate-spin" />
          <p className="text-sm font-medium text-gray-400">Memuat daftar musik...</p>
        </div>
      </div>
    )
  }

  if (!currentMusicDetails) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white">
        <p className="text-sm text-gray-400">Tidak ada lagu yang ditemukan.</p>
      </div>
    )
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
        onError={() => {
          setIsLoading(false)
          setIsAudioPlaying(false)
        }}
      />

      <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

          <div className="text-center mb-6 flex justify-between items-center">
            <span className="text-xs font-semibold tracking-wider text-pink-400 uppercase bg-pink-500/10 px-3.5 py-1.5 rounded-full border border-pink-500/20 flex items-center gap-1.5 shadow-inner">
              <IoMusicalNotes className="text-pink-500 animate-bounce" size={14} /> 
              Distro ({musicAPI.length})
            </span>
            <div className="flex gap-2">
              <button 
                onClick={toggleShuffle} 
                className={`p-2.5 rounded-full border transition-all duration-300 ${isShuffle ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/30' : 'bg-gray-800/80 border-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Acak Lagu"
              >
                <IoShuffle size={16} />
              </button>
              <button 
                onClick={toggleLoop} 
                className={`p-2.5 rounded-full border transition-all duration-300 ${isLooping ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/30' : 'bg-gray-800/80 border-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Ulangi Lagu"
              >
                <IoRepeat size={16} />
              </button>
            </div>
          </div>

          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-8 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700/60 shadow-2xl cursor-pointer group" onClick={handleAvatar}>
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <IoReload className="w-8 h-8 text-pink-500 animate-spin" />
                <span className="text-xs font-medium text-gray-300">Memuat...</span>
              </div>
            )}
            <img 
              src={currentMusicDetails.songAvatar} 
              alt={currentMusicDetails.songName} 
              className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${avatarClass[avatarClassIndex]}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-[10px] text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">Klik ubah style cover</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-xl font-extrabold text-white truncate px-2 tracking-wide">
              {currentMusicDetails.songName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-pink-400/90 truncate px-2">
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
            <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-mono">
              <span>{musicCurrentTime}</span>
              <span>{musicTotalLength}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 px-1 bg-gray-950/40 p-2.5 rounded-2xl border border-gray-800/50">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
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
            <span className="text-[11px] font-mono text-gray-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={handlePrevSong} className="p-3.5 rounded-full bg-gray-800/80 border border-gray-700/60 text-gray-300 hover:text-white hover:bg-gray-700 transition-all active:scale-95 shadow-md">
              <MdSkipPrevious size={20} />
            </button>
            <button onClick={handleAudioPlay} disabled={isLoading} className="p-4 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-xl shadow-pink-600/30 transition-all active:scale-95 disabled:opacity-50">
              {isAudioPlaying ? <IoPause size={22} /> : <IoPlaySharp size={22} />}
            </button>
            <button onClick={handleNextSong} className="p-3.5 rounded-full bg-gray-800/80 border border-gray-700/60 text-gray-300 hover:text-white hover:bg-gray-700 transition-all active:scale-95 shadow-md">
              <IoPlaySkipForward size={20} />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800/80">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Daftar Putar</h3>
            
            <div className="max-h-44 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
              {musicAPI.map((song, idx) => (
                <div 
                  key={idx}
                  onClick={() => updateCurrentMusicDetails(idx)}
                  className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300 text-xs border ${
                    musicIndex === idx 
                      ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 font-semibold shadow-sm' 
                      : 'bg-gray-800/30 border-gray-800/40 hover:bg-gray-800/80 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 border ${musicIndex === idx ? 'border-pink-500/50' : 'border-gray-700/50'}`}>
                      <img src={song.songAvatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <p className={`truncate transition-colors ${musicIndex === idx ? 'text-pink-300' : 'group-hover:text-white'}`}>{song.songName}</p>
                      <p className="text-[10px] text-gray-500 truncate font-normal">{song.songArtist}</p>
                    </div>
                  </div>
                  {musicIndex === idx && (
                    <div className="flex items-center gap-1 flex-shrink-0 bg-pink-500/20 px-2 py-1 rounded-full border border-pink-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span>
                      <span className="text-[9px] font-bold tracking-wider text-pink-400">PUTAR</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <div 
        ref={playerRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className="fixed bottom-5 right-5 z-50 cursor-grab active:cursor-grabbing select-none transition-all duration-300 hover:scale-[1.01]"
      >
        <div className="flex items-center gap-3.5 bg-gray-900/90 backdrop-blur-2xl border border-gray-800/80 p-3.5 rounded-2xl shadow-2xl max-w-[320px] sm:max-w-sm w-full text-white ring-1 ring-white/5">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700/50 shadow-md">
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <IoReload className="w-4 h-4 text-pink-500 animate-spin" />
              </div>
            )}
            <img src={currentMusicDetails.songAvatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="flex-grow min-w-0 pointer-events-none">
            <h4 className="text-xs font-bold text-white truncate tracking-wide">{currentMusicDetails.songName}</h4>
            <p className="text-[10px] text-pink-400/90 truncate mt-0.5">{currentMusicDetails.songArtist}</p>
            <div className="w-full bg-gray-800/80 h-1 rounded-full mt-2 overflow-hidden border border-gray-700/30">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-200" style={{ width: `${audioProgress}%` }}></div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
            <button onClick={handlePrevSong} className="p-1.5 text-gray-400 hover:text-white transition-colors hidden sm:block">
              <MdSkipPrevious size={18} />
            </button>
            <button onClick={handleAudioPlay} disabled={isLoading} className="p-2.5 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-md shadow-pink-600/30 transition-all active:scale-95">
              {isAudioPlaying ? <IoPause size={16} /> : <IoPlaySharp size={16} />}
            </button>
            <button onClick={handleNextSong} className="p-1.5 text-gray-400 hover:text-white transition-colors">
              <IoPlaySkipForward size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.3);
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.6);
        }
      `}</style>
    </>
  )
}