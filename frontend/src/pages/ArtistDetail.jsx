import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArtistByName, fetchSongsByArtist } from '../services/musicService';
import './ArtistDetail.css';

export default function ArtistDetail() {
    const { name } = useParams();
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setLoading(true);
                const artistData = await fetchArtistByName(name);
                const songsData = await fetchSongsByArtist(name);

                if (isMounted) {
                    setArtist(artistData);
                    setSongs(songsData);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load artist details.');
                    setLoading(false);
                }
            }
        }

        if (name) {
            loadData();
        }

        return () => {
            isMounted = false;
        };
    }, [name]);

    if (loading) return <div className="artist-detail-page"><p>Loading artist...</p></div>;
    if (error) return <div className="artist-detail-page"><p className="error-message">{error}</p><Link to="/artists">Back to Artists</Link></div>;
    if (!artist) return <div className="artist-detail-page"><p>Artist not found.</p></div>;

    const backendUrl = 'http://localhost:4000';
    const getFullUrl = (path) => path.startsWith('http') ? path : `${backendUrl}${path}`;

    return (
        <div className="artist-detail-page">
            <div className="artist-header">
                <img src={getFullUrl(artist.image)} alt={artist.name} className="artist-image"
                    onError={(e) => { e.target.src = '/assets/images/default-artist.jpg'; }} />
                <div className="artist-info">
                    <h1>{artist.name}</h1>
                    <p>{songs.length} {songs.length === 1 ? 'Song' : 'Songs'}</p>
                </div>
            </div>

            <div className="song-list">
                {songs.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No songs found for this artist.</p>
                ) : (
                    songs.map((song, index) => (
                        <div className="song-item" key={song._id}>
                            <img src={getFullUrl(song.image)} alt={song.title}
                                onError={(e) => { e.target.src = '/assets/images/default-song.svg'; }} />
                            <div className="song-info">
                                <h3>{song.title}</h3>
                                <p>{song.plays.toLocaleString()} plays</p>
                            </div>
                            <div className="song-audio">
                                {song.audioUrl ? (
                                    <audio controls src={getFullUrl(song.audioUrl)}>
                                        Your browser does not support the audio element.
                                    </audio>
                                ) : (
                                    <span style={{ fontSize: '12px', color: '#ff5555', marginLeft: '20px' }}>Audio unavailable</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
