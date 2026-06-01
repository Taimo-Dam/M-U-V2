import SongCard from '../cards/SongCard';
import './SongGrid.css';

export default function SongGrid({ songs }) {
    return (
        <div className="song-grid">
            {songs.map(song => (
                <SongCard key={song._id || song.id} song={song} playlist={songs} />
            ))}
        </div>
    );
}
