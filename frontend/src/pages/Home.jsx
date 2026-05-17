import { useState, useEffect } from 'react';
import Hero from '../components/BackGround/BackGround';
import SongGrid from '../components/common/SongGrid';
import { fetchSongs, fetchArtists } from '../services/musicService';
import '../styles/Home.css';

export default function Home() {
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const [songsData, artistsData] = await Promise.all([fetchSongs(), fetchArtists()]);
                if (isMounted) {
                    setSongs(songsData);
                    setArtists(artistsData);
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError('Failed to load music data.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="home-page">
            <Hero sidebarOpen={false} />
            
            <div className="content-section">
                <h2>Trending Now</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && <SongGrid songs={songs} />}
            </div>

            <div className="content-section">
                <h2>Popular Artists</h2>
                {loading && <p>Loading artists...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <div className="artists-grid">
                        {artists.map(artist => (
                            <div key={artist._id ?? artist.id} className="artist-card">
                                <img src={artist.image} alt={artist.name} />
                                <p>{artist.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
