import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { PlayerContext } from '../../context/PlayerContext';
import { searchMusic, getAssetUrl } from '../../services/musicService';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ songs: [], artists: [] });
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const { playSong } = useContext(PlayerContext);

    // Dynamic search effect
    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            const delayDebounce = setTimeout(async () => {
                try {
                    const data = await searchMusic(searchQuery);
                    setSearchResults(data);
                    setShowSearchResults(true);
                } catch (err) {
                    console.error('Search failed:', err);
                }
            }, 300); // 300ms debounce
            return () => clearTimeout(delayDebounce);
        } else {
            setSearchResults({ songs: [], artists: [] });
            setShowSearchResults(false);
        }
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            setShowSearchResults(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-profile')) {
                setShowProfileMenu(false);
            }
            if (!e.target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">M&U</Link>

                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                if (searchQuery.trim().length >= 2) {
                                    setShowSearchResults(true);
                                }
                            }}
                            placeholder="Search For Musics, Artists, ..."
                            className="search-input"
                            minLength="2"
                            autoComplete="off"
                        />
                        <button type="submit" className="search-button">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                    {showSearchResults && (
                        <div className="search-results show">
                            {searchResults.artists.length === 0 && searchResults.songs.length === 0 ? (
                                <div className="no-results">No results found</div>
                            ) : (
                                <>
                                    {searchResults.artists.length > 0 && (
                                        <div className="result-section">
                                            <h3>Artists</h3>
                                            {searchResults.artists.map(artist => (
                                                <Link
                                                    key={artist._id}
                                                    to={`/artist/${encodeURIComponent(artist.name)}`}
                                                    className="result-item"
                                                    onClick={() => {
                                                        setShowSearchResults(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <img
                                                        src={getAssetUrl(artist.image) || '/assets/images/default-artist.jpg'}
                                                        alt={artist.name}
                                                        onError={(e) => { e.target.src = '/assets/images/default-artist.jpg'; }}
                                                    />
                                                    <div className="result-info">
                                                        <span className="result-title">{artist.name}</span>
                                                        <small>{artist.songs} songs</small>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {searchResults.songs.length > 0 && (
                                        <div className="result-section">
                                            <h3>Songs</h3>
                                            {searchResults.songs.map(song => (
                                                <div
                                                    key={song._id}
                                                    className="result-item"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        playSong(song, searchResults.songs);
                                                        setShowSearchResults(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <img
                                                        src={getAssetUrl(song.image) || '/assets/images/default-song.svg'}
                                                        alt={song.title}
                                                        onError={(e) => { e.target.src = '/assets/images/default-song.svg'; }}
                                                    />
                                                    <div className="result-info">
                                                        <span className="result-title">{song.title}</span>
                                                        <small>{song.artist}</small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="header-right">
                <nav>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/premium">Premium</Link>
                    {user ? (
                        <>
                            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginLeft: '15px', marginRight: '15px' }}>Hi, {user.username}</span>
                            <Link to="/logout">Logout</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register"><button className="button">Sign up</button></Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}