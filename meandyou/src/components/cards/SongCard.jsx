import './SongCard.css';

export default function SongCard({ song, onPlay }) {
    return (
        <div className="song-card">
            <div className="song-image">
                <img src={song.image || '/images/default-song.jpg'} alt={song.title} />
                <button className="play-btn" onClick={() => onPlay(song)}>
                    <i className="bx bxs-play-circle"></i>
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
