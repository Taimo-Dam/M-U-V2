import './ArtistCard.css';

export default function ArtistCard({ artist }) {
    return (
        <div className="artist-card">
            <div className="artist-image">
                <img src={artist.image || '/images/default-avatar.jpg'} alt={artist.name} />
                <div className="artist-overlay">
                    <button className="follow-btn">Follow</button>
                </div>
            </div>
            <div className="artist-info">
                <h3>{artist.name}</h3>
                <span className="song-count">{artist.songs} songs</span>
            </div>
        </div>
    );
}
