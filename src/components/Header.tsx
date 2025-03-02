import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import AuthModal from "./AuthModal";
import CurrencyToggle from "./CurrencyToggle";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-800/80 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Rocket className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
              CrypTo RacKet
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <CurrencyToggle />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-yellow-400 to-pink-500 
                       text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Header;