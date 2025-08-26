import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the page components to avoid complex dependencies
jest.mock('./pages/LandingPage', () => {
  return function MockLandingPage() {
    return <div data-testid="landing-page">Landing Page</div>;
  };
});

jest.mock('./pages/CreateRoom', () => {
  return function MockCreateRoom() {
    return <div data-testid="create-room">Create Room</div>;
  };
});

jest.mock('./pages/GamePage', () => {
  return function MockGamePage() {
    return <div data-testid="game-page">Game Page</div>;
  };
});

jest.mock('./pages/JoinGame', () => {
  return function MockJoinGame() {
    return <div data-testid="join-game">Join Game</div>;
  };
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container">Toast Container</div>,
}));

describe('App Component', () => {
  test('should render without crashing', () => {
    render(<App />);
    
    // Check that the app renders and shows the landing page (default route)
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  test('should render toast container', () => {
    render(<App />);
    
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('should have correct route structure', () => {
    render(<App />);
    
    // Since we're on the default route (/), we should see the landing page
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    expect(screen.queryByTestId('create-room')).not.toBeInTheDocument();
    expect(screen.queryByTestId('game-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('join-game')).not.toBeInTheDocument();
  });
});
