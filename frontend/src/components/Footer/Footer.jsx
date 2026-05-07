import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>About</h3>
                    <p>Me and You is a website that has been created for over <span className="highlight">1 month</span> now and it is one of the most famous music player websites in the world. On this website, you can listen and download songs for free. Also, if you want no limitations, you can buy our <a href="#" className="premium-link">premium pass</a>.</p>
                </div>
                
                <div className="footer-section meandyou">
                    <h3>Melodies</h3>
                    <ul>
                        <li><a href="/songs" className="footer-link">Songs</a></li>
                        <li><a href="#" className="footer-link">Radio</a></li>
                        <li><a href="#" className="footer-link">Podcast</a></li>
                    </ul>
                </div>
                
                <div className="footer-section access">
                    <h3>Access</h3>
                    <ul>
                        <li><a href="#" className="footer-link">Explore</a></li>
                        <li><a href="#" className="footer-link">Artists</a></li>
                        <li><a href="#" className="footer-link">Playlists</a></li>
                        <li><a href="#" className="footer-link">Albums</a></li>
                        <li><a href="#" className="footer-link">Trending</a></li>
                    </ul>
                </div>
                
                <div className="footer-section contact">
                    <h3>Contact</h3>
                    <ul>
                        <li><a href="#" className="footer-link">About</a></li>
                        <li><a href="#" className="footer-link">Policy</a></li>
                        <li><a href="#" className="footer-link">Social Media</a></li>
                        <li><a href="#" className="footer-link">Support</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <h2 className="gradient-text">Me and You</h2>
                <p>© {currentYear} M&U - All rights reserved</p>
                <div className="social-icons">
                    <a href="https://www.facebook.com/profile.php?id=100091971228356" className="social-icon" title="Facebook">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="#" className="social-icon" title="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-icon" title="Twitter">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-icon" title="Contact">
                        <i className="fas fa-phone"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}
