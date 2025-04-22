import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Board from './pages/Board';
import BoardDetail from './pages/BoardDetail';
import Header from './components/Header';
import './styles/index.css';
import './styles/style.css';

function App() {
  return (
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board" element={<Board />} />
            <Route path="/board/:id" element={<BoardDetail />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;