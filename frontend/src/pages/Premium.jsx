import { Link } from 'react-router-dom';
import './Premium.css';

export default function Premium() {
  return (
    <div className="premium-page">
      <div className="premium-hero">
        <h1>Go Premium</h1>
        <p>Unlock the best listening experience with exclusive perks and no limits.</p>
      </div>

      <section className="premium-benefits">
        <h2>Premium Benefits</h2>
        <ul>
          <li>Ad-free listening across the entire site.</li>
          <li>High-quality audio streaming without interruptions.</li>
          <li>Offline downloads for your favorite playlists.</li>
          <li>Early access to new songs and special artist features.</li>
        </ul>
      </section>

      <section className="premium-plan">
        <h2>Simple Premium Plan</h2>
        <div className="premium-plan-card">
          <h3>Premium Pass</h3>
          <p className="price">Only 1 month free trial, then enjoy unlimited music.</p>
          <ul>
            <li>Unlimited skips</li>
            <li>Stream without ads</li>
            <li>Offline listening</li>
            <li>Priority support</li>
          </ul>
          <Link to="/register" className="premium-cta">Start Premium</Link>
        </div>
      </section>
    </div>
  );
}
