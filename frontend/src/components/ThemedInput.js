import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemedInput = ({ type = "text", className = "", style = {}, ...props }) => {
  const { isDark } = useTheme();
  
  // Inputs sempre claros, mas com bordas elegantes no modo escuro
  const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#333333',
    border: isDark ? '2px solid #4a9eff' : '1px solid #ddd',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    width: '100%',
    minHeight: '40px',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: isDark ? '0 2px 8px rgba(74, 158, 255, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    ...style
  };

  const handleFocus = (e) => {
    if (isDark) {
      e.target.style.boxShadow = '0 0 0 3px rgba(74, 158, 255, 0.3)';
      e.target.style.borderColor = '#66b3ff';
    } else {
      e.target.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.25)';
      e.target.style.borderColor = '#86b7fe';
    }
  };

  const handleBlur = (e) => {
    e.target.style.boxShadow = isDark ? '0 2px 8px rgba(74, 158, 255, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)';
    e.target.style.borderColor = isDark ? '#4a9eff' : '#ddd';
  };

  return (
    <input
      type={type}
      className={className}
      style={inputStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};

const ThemedSelect = ({ className = "", style = {}, children, ...props }) => {
  const { isDark } = useTheme();
  
  const selectStyle = {
    backgroundColor: '#ffffff',
    color: '#333333',
    border: isDark ? '2px solid #4a9eff' : '1px solid #ddd',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    width: '100%',
    minHeight: '40px',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    boxShadow: isDark ? '0 2px 8px rgba(74, 158, 255, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    ...style
  };

  const handleFocus = (e) => {
    if (isDark) {
      e.target.style.boxShadow = '0 0 0 3px rgba(74, 158, 255, 0.3)';
      e.target.style.borderColor = '#66b3ff';
    } else {
      e.target.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.25)';
      e.target.style.borderColor = '#86b7fe';
    }
  };

  const handleBlur = (e) => {
    e.target.style.boxShadow = isDark ? '0 2px 8px rgba(74, 158, 255, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)';
    e.target.style.borderColor = isDark ? '#4a9eff' : '#ddd';
  };

  return (
    <select
      className={className}
      style={selectStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </select>
  );
};

const ThemedTextarea = ({ className = "", style = {}, ...props }) => {
  const { isDark } = useTheme();
  
  const textareaStyle = {
    backgroundColor: '#ffffff',
    color: '#333333',
    border: isDark ? '2px solid #4a9eff' : '1px solid #ddd',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    width: '100%',
    minHeight: '80px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxShadow: isDark ? '0 2px 8px rgba(74, 158, 255, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    ...style
  };

  const handleFocus = (e) => {
    if (isDark) {
      e.target.style.boxShadow = '0 0 0 3px rgba(74, 158, 255, 0.3)';
      e.target.style.borderColor = '#66b3ff';
    } else {
      e.target.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.25)';
      e.target.style.borderColor = '#86b7fe';
    }
  };

  const handleBlur = (e) => {
    e.target.style.boxShadow = isDark ? '0 2px 8px rgba(74, 158, 255, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)';
    e.target.style.borderColor = isDark ? '#4a9eff' : '#ddd';
  };

  return (
    <textarea
      className={className}
      style={textareaStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export { ThemedInput, ThemedSelect, ThemedTextarea }; 