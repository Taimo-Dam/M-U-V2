import { getAssetUrl } from '../../services/musicService';
import './AlbumCard.css';

export default function AlbumCard({ album }) {
    return (
        <div className="album-card">
            <div className="album-image">
                <img src={getAssetUrl(album.image) || '/images/default-album.svg'} alt={album.title} />
                <div className="album-overlay">
                    <button className="play-btn">
                        <i className="bx bxs-play-circle"></i>
                    </button>
                </div>
            </div>
            <div className="album-info">
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <span className="song-count">{album.songs} songs</span>
            </div>
        </div>
    );
}
