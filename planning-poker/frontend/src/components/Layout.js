import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function Layout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isGamePage = location.pathname.startsWith('/game/');

  const handleCopyLink = () => {
    const gameId = location.pathname.split('/').pop();
    const gameUrl = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(gameUrl);
    alert('Game link copied!');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          {isGamePage ? (
            <button
              onClick={handleCopyLink}
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Copy Link
            </button>
          ) : (
            <span className="text-lg font-bold">Planning Poker</span>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-5 w-5 text-gray-800" />
          ) : (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
