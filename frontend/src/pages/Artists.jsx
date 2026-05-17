import { useState, useEffect } from 'react';
import ArtistCard from '../components/cards/ArtistCard';
import { fetchArtists } from '../services/musicService';
import '../styles/Artists.css';

export default function Artists() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadArtists() {
            try {
                const artistsData = await fetchArtists();
                if (isMounted) {
                    setArtists(artistsData);
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError('Failed to load artists.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadArtists();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="artists-page">
            <h1>Artists</h1>
            {loading && <p>Loading artists...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
                <div className="artists-grid">
                    {artists.map(artist => (
                        <ArtistCard key={artist._id ?? artist.id} artist={artist} />
                    ))}
                </div>
            )}
        </div>
    );
}
