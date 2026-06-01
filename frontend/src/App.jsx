import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import History from './pages/History';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Playbar from './components/Playbar/Playbar';
import { useGlobalCursors } from "./styles/cursors.jsx";
import './styles/App.css';

function App (){
  const [sidebarOpen, setSidebarOpen] = useState(false);

    useGlobalCursors();
 

  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <div className="app-container">
        <Header />
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className={`main-content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
          <Routes>
            <Route path="/" element={<Home sidebarOpen={sidebarOpen} />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:name" element={<ArtistDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/artists/:name" element={<ArtistDetail />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
          <Footer />
          <Playbar />
        </div>
      </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;