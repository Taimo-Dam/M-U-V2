import './BackGround.css';

export default function Hero({ sidebarOpen }) {
    return (
        <section className={`hero ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
            <h1>All the Best Song <br /> in One Place</h1>
            <p>
                On our website, you can access an amazing collection of<br />
                popular and new songs. Stream your favorite tracks in high<br />
                quality and enjoy without interruptions. Whatever your taste in music, we have it all for you!
            </p>
            <button className="button1"><a href="#discover">Discover now</a></button>
            <button className="button2">Create Playlist</button>
        </section>
    );
}
