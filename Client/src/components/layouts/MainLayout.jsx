import React, { useContext } from 'react';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import TopBar from '../organisms/TopBar';
import ContactBar from '../organisms/ContactBar';
import BoxComponnt from '../organisms/BoxComponnt';
import { ThemeContextObject } from '../../context/ThemeContext';

const MainLayout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContextObject);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Fixed theme toggle button on the right */}
      <button
        onClick={toggleTheme}
        className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 z-50"
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      {/* Top sections */}
      <TopBar />
      <ContactBar />
      <BoxComponnt />
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
