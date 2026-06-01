'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Afficher le bouton quand l'utilisateur scrolle vers le bas
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 211, 238, 0);
          }
        }
        .scroll-to-top {
          animation: float-up 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite;
        }
        .scroll-to-top:hover {
          animation: none;
        }
      `}</style>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-28 right-4 z-50 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-cyan-300 scroll-to-top"
          aria-label="Retour en haut de page"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 19V5m-7 7l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </>
  );
}
