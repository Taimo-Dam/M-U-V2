import { useState, useEffect } from 'react';
import SongList from '../components/common/SongList';
import { fetchSongs } from '../services/musicService';
import '../styles/Songs.css';

export default function Songs() {
    const [songs, setSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSongs() {
            try {
                const songsData = await fetchSongs();
                if (isMounted) {
                    setSongs(songsData);
                    setFilteredSongs(songsData);
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError('Failed to load songs.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadSongs();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const filtered = songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSongs(filtered);
    }, [searchTerm, songs]);

    return (
        <div className="songs-page">
            <div className="songs-header">
                <h1>All Songs</h1>
                <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading && <p>Loading songs...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && <SongList songs={filteredSongs} />}
        </div>
    );
}
