import { useState, useEffect } from 'react';
import Hero from '../components/BackGround/BackGround';
import SongGrid from '../components/common/SongGrid';
import '../styles/Home.css';

export default function Home() {
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - Replace with API call later
        setTimeout(() => {
            setSongs([
                { id: 1, title: 'Song 1', artist: 'Artist 1', image: '/images/anh2.avif', duration: '3:45' },
                { id: 2, title: 'Song 2', artist: 'Artist 2', image: '/images/anh3.avif', duration: '4:12' },
                { id: 3, title: 'Song 3', artist: 'Artist 3', image: '/images/anh5.avif', duration: '3:58' },
            ]);
            setArtists([
                { id: 1, name: 'Artist 1', image: '/images/Amee/amee.jpg' },
                { id: 2, name: 'Artist 2', image: '/images/AnhTraiSayHi/' },
                { id: 3, name: 'Artist 3', image: '/images/Binz/' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div className="home-page">
            <Hero sidebarOpen={false} />
            
            <div className="content-section">
                <h2>Trending Now</h2>
                {loading ? <p>Loading...</p> : <SongGrid songs={songs} />}
            </div>

            <div className="content-section">
                <h2>Popular Artists</h2>
                <div className="artists-grid">
                    {artists.map(artist => (
                        <div key={artist.id} className="artist-card">
                            <img src={artist.image} alt={artist.name} />
                            <p>{artist.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
