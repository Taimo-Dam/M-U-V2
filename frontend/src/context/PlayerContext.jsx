import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { recordPlay } from '../services/musicService';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    
    // We can use a ref to hold the actual Audio object so we can control it directly,
    // or we can rely on a hidden <audio> tag in Playbar.jsx.
    // Given React patterns, managing the Audio object here is robust.
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;
        
        const handleEnded = () => {
            // Auto play next song if available
            if (queue.length > 0 && currentIndex < queue.length - 1) {
                const nextS = queue[currentIndex + 1];
                playSong(nextS, queue);
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    const playSong = (song, playlist = null) => {
        const backendUrl = 'http://localhost:4000';
        const audioUrl = song.audioUrl && song.audioUrl.startsWith('http') 
            ? song.audioUrl 
            : `${backendUrl}${song.audioUrl}`;

        if (!song.audioUrl) {
            console.error('No audio URL for this song');
            return;
        }

        if (currentSong && currentSong._id === song._id) {
            // Toggle play/pause if it's the same song
            togglePlayPause();
            return;
        }

        if (playlist) {
            setQueue(playlist);
            const index = playlist.findIndex(s => s._id === song._id);
            setCurrentIndex(index !== -1 ? index : 0);
        } else if (queue.length === 0) {
            setQueue([song]);
            setCurrentIndex(0);
        }

        setCurrentSong(song);
        audioRef.current.src = audioUrl;
        audioRef.current.play()
            .then(() => {
                setIsPlaying(true);
                // Fire and forget recording the play
                recordPlay(song._id, user?.token).catch(e => console.error("Failed to record play:", e));
            })
            .catch(e => console.error("Playback failed:", e));
    };

    const nextSong = () => {
        if (queue.length > 0 && currentIndex < queue.length - 1) {
            const nextS = queue[currentIndex + 1];
            playSong(nextS, queue);
        }
    };

    const prevSong = () => {
        if (queue.length > 0 && currentIndex > 0) {
            const prevS = queue[currentIndex - 1];
            playSong(prevS, queue);
        }
    };

    const togglePlayPause = () => {
        if (!currentSong) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Playback failed:", e));
        }
    };

    const value = {
        currentSong,
        isPlaying,
        playSong,
        togglePlayPause,
        nextSong,
        prevSong,
        audioRef
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};
