import React from 'react';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import TopBar from '../organisms/TopBar';
import ContactBar from '../organisms/ContactBar';
import BoxComponnt from '../organisms/BoxComponnt';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-0 bg-gray-50">
      {/* Top sections */}
      <TopBar />
      <ContactBar />
      <BoxComponnt />
      <Navbar />

      {/* Main content */}
      <main className="">
        {children}
      </main>

      {/* Footer directly below the content */}
      <Footer />
    </div>
  );
};

export default MainLayout;
