import { useState, useEffect } from 'react';
import SongList from '../components/common/SongList';
import '../styles/Songs.css';

export default function Songs() {
    const [songs, setSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock data
        const mockSongs = [
            { id: 1, title: 'Anh Trai Say Hi', artist: 'Anh Trai Say Hi', duration: '3:45', plays: 1250 },
            { id: 2, title: 'Nơi Này Có Anh', artist: 'Sơn Tùng MTP', duration: '4:12', plays: 2500 },
            { id: 3, title: 'Em Của Ngày Hôm Qua', artist: 'Sơn Tùng MTP', duration: '3:58', plays: 3100 },
        ];
        setSongs(mockSongs);
        setFilteredSongs(mockSongs);
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
            <SongList songs={filteredSongs} />
        </div>
    );
}
