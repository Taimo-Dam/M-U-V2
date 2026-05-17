import { useState, useEffect } from 'react';
import AlbumCard from '../components/cards/AlbumCard';
import { fetchAlbums } from '../services/musicService';
import '../styles/Albums.css';

export default function Albums() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadAlbums() {
            try {
                const albumsData = await fetchAlbums();
                if (isMounted) {
                    setAlbums(albumsData);
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError('Failed to load albums.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadAlbums();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="albums-page">
            <h1>Albums</h1>
            {loading && <p>Loading albums...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
                <div className="albums-grid">
                    {albums.map(album => (
                        <AlbumCard key={album._id ?? album.id} album={album} />
                    ))}
                </div>
            )}
        </div>
    );
}
