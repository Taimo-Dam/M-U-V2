import { useState, useEffect } from 'react';
import AlbumCard from '../components/cards/AlbumCard';
import '../styles/Albums.css';

export default function Albums() {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const mockAlbums = [
            { id: 1, title: 'Album 1', artist: 'Artist 1', image: '/images/anh2.avif', songs: 12 },
            { id: 2, title: 'Album 2', artist: 'Artist 2', image: '/images/anh3.avif', songs: 10 },
            { id: 3, title: 'Album 3', artist: 'Artist 3', image: '/images/anh5.avif', songs: 15 },
        ];
        setAlbums(mockAlbums);
    }, []);

    return (
        <div className="albums-page">
            <h1>Albums</h1>
            <div className="albums-grid">
                {albums.map(album => (
                    <AlbumCard key={album.id} album={album} />
                ))}
            </div>
        </div>
    );
}
