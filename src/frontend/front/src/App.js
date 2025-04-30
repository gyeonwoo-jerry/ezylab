// App.js
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Board from './pages/Board';
import BoardDetail from './pages/BoardDetail';
import BoardWrite from './components/BoardWrite';
import PortfolioWrite from './components/PortfolioWrite';
import Contact from './pages/Contact';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';
import './styles/style.css';

function App() {
  return (
      <AuthProvider>
      <Router>
        <div className="App" style={{ height: '100%' }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board" element={<Board />} />
            <Route path="/board/:id" element={<BoardDetail />} />
            <Route path="/board/write" element={<BoardWrite />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/portfolio/write" element={<PortfolioWrite />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
      </AuthProvider>
  );
}

export default App;