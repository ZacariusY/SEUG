import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Inicializar com o tema salvo ou false (claro) como padrão
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Aplicar tema imediatamente na inicialização
  useEffect(() => {
    applyTheme(isDark);
  }, []);

  // Aplicar tema quando mudança
  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const applyTheme = (dark) => {
    // Remover classes existentes
    document.body.classList.remove('dark-theme', 'light-theme');
    
    // Aplicar nova classe
    if (dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const getInputStyles = () => {
    if (isDark) {
      return {
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0',
        border: '1px solid #424242',
        borderRadius: '0.375rem',
        padding: '0.375rem 0.75rem',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        width: '100%',
        display: 'block',
        boxSizing: 'border-box'
      };
    } else {
      return {
        backgroundColor: '#ffffff',
        color: '#212529',
        border: '1px solid #dee2e6',
        borderRadius: '0.375rem',
        padding: '0.375rem 0.75rem',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        width: '100%',
        display: 'block',
        boxSizing: 'border-box'
      };
    }
  };

  const getInputFocusStyles = () => {
    if (isDark) {
      return {
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0',
        borderColor: '#86b7fe',
        outline: '0',
        boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
      };
    } else {
      return {
        backgroundColor: '#ffffff',
        color: '#212529',
        borderColor: '#86b7fe',
        outline: '0',
        boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
      };
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, getInputStyles, getInputFocusStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}; 