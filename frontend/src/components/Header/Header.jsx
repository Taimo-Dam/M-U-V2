import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, logout } = useContext(AuthContext);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            // Navigate to search results
            window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-profile')) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <a href="/" className="logo">M&U</a>

                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search For Musics, Artists, ..."
                            className="search-input"
                            minLength="2"
                            autoComplete="off"
                        />
                        <button type="submit" className="search-button">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                    <div className="search-results" id="searchResults"></div>
                </div>
            </div>

            <div className="header-right">
                <nav>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    <a href="/premium">Premium</a>
                    {user ? (
                        <>
                            <div className="user-profile" onClick={handleProfileClick} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer', marginLeft: '15px' }}>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{user.username}</span>
                                {showProfileMenu && (
                                    <div className="profile-dropdown" style={{ position: 'absolute', top: '100%', right: '0', background: 'var(--panel-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '120px', zIndex: 100 }}>
                                        <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '5px' }}>Logout</button>
                                    </div>
                                )}
                            </div>
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