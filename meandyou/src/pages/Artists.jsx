import { useState, useEffect } from 'react';
import ArtistCard from '../components/cards/ArtistCard';
import '../styles/Artists.css';

export default function Artists() {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const mockArtists = [
            { id: 1, name: 'Sơn Tùng MTP', image: '/images/sontungmtp/sontung-avatar.jfif', songs: 45 },
            { id: 2, name: 'Amee', image: '/images/Amee/', songs: 38 },
            { id: 3, name: 'Anh Trai Say Hi', image: '/images/AnhTraiSayHi/', songs: 52 },
            { id: 4, name: 'Soobin', image: '/images/SooBin/', songs: 41 },
        ];
        setArtists(mockArtists);
    }, []);

    return (
        <div className="artists-page">
            <h1>Artists</h1>
            <div className="artists-grid">
                {artists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                ))}
            </div>
        </div>
    );
}
