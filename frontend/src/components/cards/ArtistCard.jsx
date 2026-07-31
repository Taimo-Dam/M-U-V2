import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../services/musicService';
// import './ArtistCard.css'; // Removed as the CSS is now in Artists.css

export default function ArtistCard({ artist }) {
    return (
        <Link to={`/artist/${encodeURIComponent(artist.name)}`} className="card">
            <img 
                src={getAssetUrl(artist.image) || '/assets/images/default-artist.jpg'} 
                alt={artist.name} 
                onError={(e) => {
                    e.target.src = '/assets/images/default-artist.jpg';
                }}
            />
            <p>{artist.name}</p>
        </Link>
    );
}
