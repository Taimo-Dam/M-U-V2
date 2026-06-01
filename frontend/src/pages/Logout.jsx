import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Logout() {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#fff' }}>
            <h2>Logging you out...</h2>
        </div>
    );
}
