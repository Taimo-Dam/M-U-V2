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
    
    const audioRef = useRef(new Audio());
    const queueRef = useRef(queue);
    const currentIndexRef = useRef(currentIndex);

    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    const playSongRef = useRef();

    const playSong = (song, playlist = null) => {
        const rawApiUrl = import.meta.env.VITE_API_URL || '';
        const backendOrigin = rawApiUrl.replace(/\/api\/?$/, '');
        const audioUrl = song.audioUrl && song.audioUrl.startsWith('http') 
            ? song.audioUrl 
            : `${backendOrigin}${song.audioUrl.startsWith('/') ? song.audioUrl : `/${song.audioUrl}`}`;

        if (!song.audioUrl) {
            console.error('No audio URL for this song');
            return;
        }

        if (currentSong && currentSong._id === song._id) {
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
                recordPlay(song._id, user?.token).catch(e => console.error("Failed to record play:", e));
            })
            .catch(e => console.error("Playback failed:", e));
    };

    playSongRef.current = playSong;

    const nextSong = () => {
        const q = queueRef.current;
        const idx = currentIndexRef.current;
        if (q.length > 0 && idx < q.length - 1) {
            const nextS = q[idx + 1];
            playSongRef.current(nextS, q);
        }
    };

    const prevSong = () => {
        const q = queueRef.current;
        const idx = currentIndexRef.current;
        if (q.length > 0 && idx > 0) {
            const prevS = q[idx - 1];
            playSongRef.current(prevS, q);
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

    useEffect(() => {
        const audio = audioRef.current;
        
        const handleEnded = () => {
            const q = queueRef.current;
            const idx = currentIndexRef.current;
            if (q.length > 0 && idx < q.length - 1) {
                const nextS = q[idx + 1];
                if (playSongRef.current) {
                    playSongRef.current(nextS, q);
                }
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

