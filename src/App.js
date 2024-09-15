import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
