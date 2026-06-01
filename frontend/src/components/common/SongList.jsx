import { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import './SongList.css';

export default function SongList({ songs }) {
    const { currentSong, isPlaying, playSong } = useContext(PlayerContext);
    return (
        <div className="song-list">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Duration</th>
                        <th>Plays</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => (
                        <tr key={song.id}>
                            <td>{index + 1}</td>
                            <td>{song.title}</td>
                            <td>{song.artist}</td>
                            <td>{song.duration}</td>
                            <td>{song.plays}</td>
                            <td>
                                <button className="play-btn" onClick={() => playSong(song, songs)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5em', color: 'var(--primary-color)' }}>
                                    <i className={currentSong?._id === song._id && isPlaying ? 'bx bx-pause-circle' : 'bx bx-play-circle'}></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
