'use client'

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  backgroundColor?: string;
  hoverColor?: string;
  padding?: string;
  borderRadius?: string;
  textColor?: string;
  customStyles?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset'; // New prop for button type
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  backgroundColor = '#007bff',
  hoverColor = '#0056b3',
  padding = '10px 20px',
  borderRadius = '5px',
  textColor = '#ffffff',
  customStyles = {},
  type = 'button', // Default to 'button'
  onClick,
}) => {
  return (
    <button
      type={type}
      style={{
        backgroundColor,
        color: textColor,
        padding,
        borderRadius,
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        ...customStyles,
      }}
      onClick={onClick}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = backgroundColor)}
    >
      {children}
    </button>
  );
};

export default Button;
