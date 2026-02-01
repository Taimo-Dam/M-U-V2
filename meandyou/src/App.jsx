import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import './styles/cursors.css';
import './styles/App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;