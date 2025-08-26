import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../../components/Navbar';

// Mock DarkModeBtn component
jest.mock('../../components/DarkModeBtn', () => {
  return function MockDarkModeBtn() {
    return <div data-testid="dark-mode-btn">Dark Mode Button</div>;
  };
});

describe('Navbar Component', () => {
  test('should render logo and planning poker text', () => {
    render(<Navbar />);
    
    expect(screen.getByAltText('Planning Poker Logo')).toBeInTheDocument();
    expect(screen.getByText('Planning Poker')).toBeInTheDocument();
  });

  test('should render dark mode button', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('dark-mode-btn')).toBeInTheDocument();
  });

  test('should render navbar elements correctly', () => {
    render(<Navbar />);
    
    // Test that all elements are present
    expect(screen.getByAltText('Planning Poker Logo')).toBeInTheDocument();
    expect(screen.getByText('Planning Poker')).toBeInTheDocument();
    expect(screen.getByTestId('dark-mode-btn')).toBeInTheDocument();
  });
});
