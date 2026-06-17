import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Need help or want to share feedback? We’re here to listen.</p>
      </div>

      <section className="contact-section">
        <div className="contact-card">
          <h2>Support</h2>
          <p>For help with playback, account access, or technical issues, email us at:</p>
          <a href="mailto:support@meandyou.com" className="contact-link">support@meandyou.com</a>
        </div>

        <div className="contact-card">
          <h2>Partnerships</h2>
          <p>Want to collaborate or bring your music to our platform? Reach out to:</p>
          <a href="mailto:partners@meandyou.com" className="contact-link">partners@meandyou.com</a>
        </div>
      </section>

      <section className="contact-section">
        <h2>Stay Connected</h2>
        <p>Follow us on social media for updates, new releases, and special offers.</p>
        <div className="contact-socials">
          <span>Facebook</span>
          <span>Instagram</span>
          <span>Twitter</span>
        </div>
      </section>
    </div>
  );
}
