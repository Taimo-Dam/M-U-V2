import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getHistory } from '../services/musicService';
import SongList from '../components/common/SongList';
import './History.css';

export default function History() {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.token) {
            getHistory(user.token)
                .then(data => {
                    setHistory(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load history:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="history-page">
                <h2>Listening History</h2>
                <p>Please log in to see your listening history.</p>
            </div>
        );
    }

    return (
        <div className="history-page">
            <h2>Your Listening History</h2>
            {loading ? (
                <p>Loading history...</p>
            ) : history.length === 0 ? (
                <p>You haven't listened to any songs yet. Go discover some music!</p>
            ) : (
                <SongList songs={history} />
            )}
        </div>
    );
}
