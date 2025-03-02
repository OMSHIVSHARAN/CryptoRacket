import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TrendingAssets from './pages/TrendingAssets';
import TopCryptoList from './pages/TopCryptoList';
import PredictiveAnalysis from './pages/PredictiveAnalysis';
import Community from './pages/Community';
import Education from './pages/Education';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import CryptoDetail from './pages/CryptoDetail';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-900">
            <Header />
            <Navigation />
            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <Features />
                    </>
                  }
                />
                <Route path="/trending" element={<TrendingAssets />} />
                <Route path="/top-crypto" element={<TopCryptoList />} />
                <Route path="/predictive" element={<PredictiveAnalysis />} />
                <Route path="/community" element={<Community />} />
                <Route path="/education" element={<Education />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/crypto/:id" element={<CryptoDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}
export default App;