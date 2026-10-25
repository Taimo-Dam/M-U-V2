import { useState, useEffect, useContext } from 'react';
import Hero from '../components/BackGround/BackGround';
import SongGrid from '../components/common/SongGrid';
import { fetchSongs, fetchArtists, fetchRecommendations, fetchSmartPlaylist, getAssetUrl } from '../services/musicService';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

export default function Home() {
    const { user } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [trendingSongs, setTrendingSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationError, setRecommendationError] = useState('');
    const [selectedTrackId, setSelectedTrackId] = useState('');
    const [smartPlaylist, setSmartPlaylist] = useState([]);
    const [smartPlaylistError, setSmartPlaylistError] = useState('');
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const [songsData, artistsData] = await Promise.all([fetchSongs(), fetchArtists()]);
                if (isMounted) {
                    const randomSongs = [...songsData].sort(() => 0.5 - Math.random()).slice(0, 10);
                    setSongs(songsData);
                    setTrendingSongs(randomSongs);
                    setArtists(artistsData);
                    setSelectedTrackId((currentId) => currentId || songsData[0]?._id || '');
                }
            } catch {
                if (isMounted) {
                    setError('Failed to load music data.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        async function loadRecommendations() {
            if (!user?.token) {
                return;
            }
            try {
                const data = await fetchRecommendations(user.token);
                if (isMounted) {
                    setRecommendations(data.items || []);
                    setRecommendationError('');
                }
            } catch (fetchError) {
                if (isMounted) {
                    setRecommendationError(
                        fetchError.response?.data?.message || 'Không thể tải gợi ý. Hãy kiểm tra kết nối Neo4j.'
                    );
                }
            }
        }

        loadData();
        loadRecommendations();

        return () => {
            isMounted = false;
        };
    }, [user?.token]);

    const createSmartPlaylist = async () => {
        if (!selectedTrackId) return;
        setPlaylistLoading(true);
        setSmartPlaylistError('');
        try {
            const data = await fetchSmartPlaylist(selectedTrackId, user?.token);
            setSmartPlaylist([data.seed, ...data.items.map((item) => item.song)]);
        } catch (playlistError) {
            setSmartPlaylist([]);
            setSmartPlaylistError(
                playlistError.response?.data?.message || 'Không thể tạo playlist. Hãy đồng bộ danh mục và kiểm tra kết nối Neo4j.'
            );
        } finally {
            setPlaylistLoading(false);
        }
    };

    return (
        <div className="home-page">
            <Hero sidebarOpen={false} />
            
            <div className="content-section">
                <h2>Trending Now</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && <SongGrid songs={trendingSongs} />}
            </div>

            {user?.token && (
                <div className="content-section">
                    <h2>Dành cho bạn</h2>
                    {recommendationError && <p className="error-message">{recommendationError}</p>}
                    {!recommendationError && recommendations.length > 0 && (
                        <SongGrid songs={recommendations.map((item) => item.song)} />
                    )}
                    {!recommendationError && !recommendations.length && !loading && (
                        <p>Chưa có đủ lịch sử nghe để tạo gợi ý.</p>
                    )}
                </div>
            )}

            <div className="content-section">
                <h2>Tạo Smart Playlist</h2>
                <div className="smart-playlist-controls">
                    <select
                        aria-label="Chọn bài hát làm điểm bắt đầu"
                        value={selectedTrackId}
                        onChange={(event) => setSelectedTrackId(event.target.value)}
                        disabled={loading || songs.length === 0}
                    >
                        {songs.map((song) => (
                            <option key={song._id} value={song._id}>{song.title} — {song.artist}</option>
                        ))}
                    </select>
                    <button type="button" onClick={createSmartPlaylist} disabled={!selectedTrackId || playlistLoading}>
                        {playlistLoading ? 'Đang tạo...' : 'Tạo playlist'}
                    </button>
                </div>
                {smartPlaylistError && <p className="error-message">{smartPlaylistError}</p>}
                {smartPlaylist.length > 0 && <SongGrid songs={smartPlaylist} />}
            </div>

            <div className="content-section">
                <h2>Popular Artists</h2>
                {loading && <p>Loading artists...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <div className="artists-grid">
                        {artists.map(artist => (
                            <div key={artist._id ?? artist.id} className="artist-card">
                                <img src={getAssetUrl(artist.image)} alt={artist.name} />
                                <p>{artist.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
