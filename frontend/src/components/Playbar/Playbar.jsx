import { useContext, useEffect, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import './Playbar.css';

export default function Playbar() {
    const { currentSong, isPlaying, togglePlayPause, nextSong, prevSong, audioRef } = useContext(PlayerContext);
    
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateTime);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateTime);
        };
    }, [audioRef]);

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressChange = (e) => {
        const newTime = Number(e.target.value);
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVol = Number(e.target.value);
        audioRef.current.volume = newVol;
        setVolume(newVol);
    };

    // Hide if nothing has been played yet
    if (!currentSong) return <div className="playbar-container hidden"></div>;

    const backendUrl = 'http://localhost:4000';
    const imageUrl = currentSong.image && currentSong.image.startsWith('http') 
        ? currentSong.image 
        : `${backendUrl}${currentSong.image || '/assets/images/default-song.svg'}`;

    return (
        <div className="playbar-container">
            {/* Left: Info */}
            <div className="playbar-left">
                <img src={imageUrl} alt={currentSong.title} className="playbar-img" 
                     onError={(e) => { e.target.src = '/assets/images/default-song.svg'; }} />
                <div className="playbar-info">
                    <h4 className="playbar-title">{currentSong.title}</h4>
                    <p className="playbar-artist">{currentSong.artist}</p>
                </div>
                <button className="control-btn" style={{ marginLeft: '15px', fontSize: '20px' }}>
                    <i className="bx bx-heart"></i>
                </button>
            </div>

            {/* Center: Controls & Progress */}
            <div className="playbar-center">
                <div className="playbar-controls">
                    <button className="control-btn" onClick={prevSong}>
                        <i className="bx bx-skip-previous"></i>
                    </button>
                    
                    <button className="control-btn play-pause" onClick={togglePlayPause}>
                        <i className={isPlaying ? 'bx bx-pause-circle' : 'bx bx-play-circle'}></i>
                    </button>
                    
                    <button className="control-btn" onClick={nextSong}>
                        <i className="bx bx-skip-next"></i>
                    </button>
                </div>
                
                <div className="playbar-progress">
                    <span className="time-text">{formatTime(progress)}</span>
                    <input 
                        type="range" 
                        className="progress-bar" 
                        min="0" 
                        max={duration || 100} 
                        value={progress} 
                        onChange={handleProgressChange}
                    />
                    <span className="time-text">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume */}
            <div className="playbar-right">
                <i className={`bx ${volume === 0 ? 'bx-volume-mute' : volume < 0.5 ? 'bx-volume-low' : 'bx-volume-full'} volume-icon`}></i>
                <input 
                    type="range" 
                    className="volume-bar" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
}
