import { useParams, Link } from 'react-router-dom';
import { fetchArtistByName, fetchSongsByArtist, getAssetUrl } from '../services/musicService';
import { PlayerContext } from '../context/PlayerContext';
import { useContext, useState, useEffect } from 'react';
import './ArtistDetail.css';

export default function ArtistDetail() {
    const { name } = useParams();
    const { currentSong, isPlaying, playSong, togglePlayPause } = useContext(PlayerContext);
    
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


    return (
        <div className="artist-detail-page">
            <div className="artist-header">
                <img src={getAssetUrl(artist.image)} alt={artist.name} className="artist-image"
                    onError={(e) => { e.target.src = '/assets/images/default-artist.jpg'; }} />
                <div className="artist-info">
                    <h1>{artist.name}</h1>
                    <p style={{ marginBottom: '15px' }}>{songs.length} {songs.length === 1 ? 'Song' : 'Songs'}</p>
                    <button className="button" style={{ padding: '8px 24px', borderRadius: '20px' }}>Follow</button>
                </div>
            </div>

            <div className="song-list">
                {songs.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No songs found for this artist.</p>
                ) : (
                    songs.map((song, index) => (
                        <div className="song-item" key={song._id}>
                            <img src={getAssetUrl(song.image)} alt={song.title}
                                onError={(e) => { e.target.src = '/assets/images/default-song.svg'; }} />
                            <div className="song-info">
                                <h3>{song.title}</h3>
                                <p>{song.plays.toLocaleString()} plays</p>
                            </div>
                            <div className="song-audio">
                                {song.audioUrl ? (
                                    <button 
                                        className="play-button" 
                                        onClick={() => playSong(song, songs)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    >
                                        <i className={currentSong?._id === song._id && isPlaying ? 'bx bx-pause-circle' : 'bx bx-play-circle'}></i>
                                    </button>
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
