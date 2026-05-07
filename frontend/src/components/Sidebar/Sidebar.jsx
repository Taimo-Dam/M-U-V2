import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button className="menu-toggle" id="menuToggle" onClick={toggleMenu}>
                <i className="bx bx-menu"></i>
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <a href="/" className="nav-link">
                        <i className="bx bxs-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="#discover" className="nav-link">
                        <i className="bx bx-music"></i>
                        <span>Discover</span>
                    </a>
                    <a href="/albums" className="nav-link" data-title="Albums">
                        <i className="fas fa-compact-disc"></i>
                        <span>Albums</span>
                    </a>
                    <a href="/artists" className="nav-link" data-title="Artists">
                        <i className="fas fa-microphone"></i>
                        <span>Artists</span>
                    </a>

                    <div className="sidebar-content">
                        <ul className="nav-list">
                            <li className="nav-category">Library</li>
                            <li className="nav-item">
                                <a href="/recent" className="nav-link" data-title="Recently Added">
                                    <i className="fas fa-history"></i>
                                    <span>Recently Added</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/most-played" className="nav-link" data-title="Most Played">
                                    <i className="fas fa-fire"></i>
                                    <span>Most Played</span>
                                </a>
                            </li>

                            <li className="nav-category">Playlist and Favorite</li>
                            <li className="nav-item">
                                <a href="/favorites" className="nav-link" data-title="Your Favorites">
                                    <i className="fas fa-heart"></i>
                                    <span>Your Favorites</span>
                                </a>
                            </li>

                            <li className="nav-item">
                                <a href="/create-playlist" className="nav-link blue" data-title="Add Playlist">
                                    <i className="fas fa-plus"></i>
                                    <span>Add Playlist</span>
                                </a>
                            </li>

                            <li className="nav-category">General</li>
                            <li className="nav-item">
                                <a href="/settings" className="nav-link" data-title="Settings">
                                    <i className="fas fa-cog"></i>
                                    <span>Settings</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <div className="overlay" onClick={() => setIsOpen(false)}></div>
        </>
    );
};

export default Sidebar;