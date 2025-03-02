import React from "react";
import { Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-800/50 backdrop-blur-sm py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-gray-300">
              Empowering traders with AI-driven crypto predictions and community insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/trending" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Trending Assets
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1"
                >
                  Features
                </button>
              </li>
              <li>
                <Link 
                  to="/community" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/education" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Education
                </Link>
              </li>
              <li>
                <a 
                  href="https://docs.example.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Documentation
                </a>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href="https://x.com/CryptooIndia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transform transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/cryptoding?igsh=MTN4aHN6bGQyMTRodw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transform transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://www.reddit.com/r/CryptoCurrency/s/Tg1kjs95OL" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transform transition-all duration-300 hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="8" r="5"/>
                  <path d="M12 13v9"/>
                  <path d="M9 16h6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-gray-700">
          <p className="text-gray-300">🚀 To the Moon! Our rocket runs on blockchain, dreams, and pure crypto magic! 🌕</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;