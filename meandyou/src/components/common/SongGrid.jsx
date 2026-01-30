import SongCard from '../cards/SongCard';
import './SongGrid.css';

export default function SongGrid({ songs, onPlay }) {
    return (
        <div className="song-grid">
            {songs.map(song => (
                <SongCard key={song.id} song={song} onPlay={onPlay} />
            ))}
        </div>
    );
}
