import React from 'react';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import TopBar from '../organisms/TopBar';
import ContactBar from '../organisms/ContactBar';
import BoxComponnt from '../organisms/BoxComponnt';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar always on top */}
      <TopBar />
      <ContactBar />
      <BoxComponnt />

      {/* Navbar below TopBar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
