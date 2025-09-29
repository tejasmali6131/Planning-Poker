import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import { toast } from 'react-toastify';
 
// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));
 
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));
 
jest.mock('../../components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});
 
// Mock localStorage
const mockLocalStorage = {
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});
 
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};
 
describe('LandingPage', () => {
  const mockNavigate = jest.fn();
 
  beforeEach(() => {
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });
 
  test('renders all essential elements', () => {
    renderWithRouter(<LandingPage />);
   
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Planning Poker!!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
 
  test('shows error when username is empty', () => {
    renderWithRouter(<LandingPage />);
   
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
   
    expect(toast.error).toHaveBeenCalledWith('Please enter a username');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
 
  test('navigates to create-room with valid username', () => {
    renderWithRouter(<LandingPage />);
   
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
   
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.click(submitButton);
   
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
    expect(mockNavigate).toHaveBeenCalledWith('/create-room');
  });
 
 
  test('trims whitespace from username', () => {
    renderWithRouter(<LandingPage />);
   
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
   
    fireEvent.change(usernameInput, { target: { value: '   ' } });
    fireEvent.click(submitButton);
   
    expect(toast.error).toHaveBeenCalledWith('Please enter a username');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
 
  test('updates username state when input changes', () => {
    renderWithRouter(<LandingPage />);
   
    const usernameInput = screen.getByPlaceholderText('Enter your username');
   
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
   
    expect(usernameInput.value).toBe('newuser');
  });
 
  test('handles Enter key press to submit form', () => {
    renderWithRouter(<LandingPage />);
   
    const usernameInput = screen.getByPlaceholderText('Enter your username');
   
    // Test Enter key with empty username
    fireEvent.keyPress(usernameInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(toast.error).toHaveBeenCalledWith('Please enter a username');
   
    // Clear mocks
    jest.clearAllMocks();
   
    // Test Enter key with valid username
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.keyPress(usernameInput, { key: 'Enter', code: 'Enter', charCode: 13 });
   
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
    expect(mockNavigate).toHaveBeenCalledWith('/create-room');
  });
 
  test('handles non-Enter key press without submitting', () => {
    renderWithRouter(<LandingPage />);
   
    const usernameInput = screen.getByPlaceholderText('Enter your username');
   
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.keyPress(usernameInput, { key: 'a', code: 'KeyA', charCode: 97 });
   
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });
 
  test('displays first motivational message initially', () => {
    renderWithRouter(<LandingPage />);
   
    expect(screen.getByText('We plan together, we win together...')).toBeInTheDocument();
  });
 
  test('has slide-in class initially for message animation', () => {
    renderWithRouter(<LandingPage />);
   
    const slideText = screen.getByText('We plan together, we win together...');
    expect(slideText).toHaveClass('slide-text');
    expect(slideText).toHaveClass('landing-page-subtitle');
    expect(slideText).toHaveClass('slide-in');
  });
 
  test('interval is set up on component mount', () => {
    jest.useFakeTimers();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
   
    renderWithRouter(<LandingPage />);
   
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
   
    setIntervalSpy.mockRestore();
    jest.useRealTimers();
  });
 
  test('cleans up interval on unmount', () => {
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
   
    const { unmount } = renderWithRouter(<LandingPage />);
   
    unmount();
   
    expect(clearIntervalSpy).toHaveBeenCalled();
   
    clearIntervalSpy.mockRestore();
    jest.useRealTimers();
  });
 
 
  test('tests setTimeout callback in interval', () => {
    jest.useFakeTimers();
   
    renderWithRouter(<LandingPage />);
   
    // Initially shows first message
    expect(screen.getByText('We plan together, we win together...')).toBeInTheDocument();
   
    // Trigger interval which sets fade to false and starts setTimeout
    act(() => {
      jest.advanceTimersByTime(5000);
    });
   
    // Now trigger the setTimeout callback (after 500ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });
   
    // Should now show second message and fade should be true again
    expect(screen.getByText('Every point counts when the team counts...')).toBeInTheDocument();
   
    const slideText = screen.getByText('Every point counts when the team counts...');
    expect(slideText).toHaveClass('slide-in');
   
    jest.useRealTimers();
  });
 
 
  test('tests complete cycle back to first message', () => {
    jest.useFakeTimers();
   
    renderWithRouter(<LandingPage />);
   
    // Cycle through all 5 messages to test the modulo wraparound
    for (let i = 0; i < 5; i++) {
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });
    }
   
    // Should cycle back to first message due to modulo operation
    expect(screen.getByText('We plan together, we win together...')).toBeInTheDocument();
   
    jest.useRealTimers();
  });
 
 
});