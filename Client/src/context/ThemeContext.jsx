// src/context/ThemeContext.jsx
import React, { createContext, useState } from 'react';

export const ThemeContextObject = createContext();

const ThemeContext = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContextObject.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContextObject.Provider>
  );
};

export default ThemeContext;
