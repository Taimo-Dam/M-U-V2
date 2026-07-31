import { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { getAssetUrl } from '../../services/musicService';
import './SongCard.css';

export default function SongCard({ song, playlist }) {
    const { currentSong, isPlaying, playSong } = useContext(PlayerContext);
    return (
        <div className="song-card">
            <div className="song-image">
                <img src={getAssetUrl(song.image) || '/images/default-song.svg'} alt={song.title} />
                <button className="play-btn" onClick={() => playSong(song, playlist)}>
                    <i className={currentSong?._id === song._id && isPlaying ? 'bx bx-pause-circle' : 'bx bxs-play-circle'}></i>
                </button>
            </div>
            <div className="song-info">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
                <span className="duration">{song.duration || '3:45'}</span>
            </div>
        </div>
    );
}
