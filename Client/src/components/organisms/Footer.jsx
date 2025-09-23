// src/components/organisms/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '1rem', background: '#eee', textAlign: 'center', marginTop: '1rem' }}>
      &copy; {new Date().getFullYear()} My Website. All rights reserved.
    </footer>
  );
};

export default Footer;
