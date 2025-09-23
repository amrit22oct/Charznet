// src/components/layouts/MainLayout.jsx
import React from 'react';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import TopBar from '../organisms/TopBar';
import ContactBar from '../organisms/ContactBar';
import BoxComponnt from '../organisms/BoxComponnt';

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <ContactBar />
      <BoxComponnt />
      <Navbar />
      
      <main className=''>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
