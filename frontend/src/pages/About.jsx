import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Me and You</h1>
        <p>Discover the story behind the music experience designed for listeners, creators, and fans.</p>
      </div>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Me and You brings people together through music. We create a modern streaming experience
          with curated playlists, artist showcases, and an easy-to-use player built for fans who love to explore.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <ul>
          <li>Free access to thousands of songs and albums.</li>
          <li>Fast search across artists, tracks, and playlists.</li>
          <li>Personalized listening history and recommendations.</li>
          <li>Premium perks for an even better music journey.</li>
        </ul>
      </section>

      <section className="about-section about-values">
        <h2>Why Choose Us?</h2>
        <div className="about-cards">
          <div className="about-card">
            <h3>Easy To Use</h3>
            <p>Navigate the site, find your favorite artists, and play music instantly on desktop or mobile.</p>
          </div>
          <div className="about-card">
            <h3>Unlimited Discovery</h3>
            <p>Explore new releases, trending artists, and fresh playlists every time you visit.</p>
          </div>
          <div className="about-card">
            <h3>Community Focused</h3>
            <p>We build features that help music fans connect with the artists and songs they love.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
