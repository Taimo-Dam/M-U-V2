import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Oops! The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="back-home-btn">Go Back Home</Link>
        </div>
    );
}
