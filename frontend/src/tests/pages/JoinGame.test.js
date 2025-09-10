import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import JoinGame from '../../pages/JoinGame';
import { toast } from 'react-toastify';
import socket from '../../socket';
import { DarkModeProvider } from '../../contexts/DarkModeContext';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ gameId: 'test-game-123' })
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

// Mock socket
jest.mock('../../socket', () => ({
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn()
}));

// Mock localStorage
const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const renderJoinGame = () => {
  return render(
    <BrowserRouter>
      <DarkModeProvider>
        <JoinGame />
      </DarkModeProvider>
    </BrowserRouter>
  );
};

describe('JoinGame Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    toast.error.mockReset();
    mockLocalStorage.setItem.mockReset();
    socket.on.mockReset();
    socket.off.mockReset();
    socket.emit.mockReset();
  });

  describe('Rendering', () => {
    test('should render join game form with correct elements', () => {
      renderJoinGame();

      expect(screen.getByText('Join Planning Session')).toBeInTheDocument();
      expect(screen.getByText('Room ID:')).toBeInTheDocument();
      expect(screen.getByText('test-game-123')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
      expect(screen.getByText('Join Game')).toBeInTheDocument();
    });

    test('should focus username input on render', () => {
      renderJoinGame();

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      expect(usernameInput).toHaveFocus();
    });
  });

  describe('Socket Event Setup', () => {
    test('should set up socket event listeners on mount', () => {
      renderJoinGame();

      expect(socket.on).toHaveBeenCalledWith('usernameExists', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('joinSuccess', expect.any(Function));
    });

    test('should clean up socket event listeners on unmount', () => {
      const { unmount } = renderJoinGame();

      unmount();

      expect(socket.off).toHaveBeenCalledWith('usernameExists');
      expect(socket.off).toHaveBeenCalledWith('joinSuccess');
    });
  });

  describe('Username Input', () => {
    test('should update username state when typing', async () => {
      renderJoinGame();

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      await userEvent.type(usernameInput, 'testuser');

      expect(usernameInput).toHaveValue('testuser');
    });

    test('should handle Enter key press to join game', async () => {
      renderJoinGame();
      
      // Clear localStorage mock calls that happened during component initialization
      mockLocalStorage.setItem.mockClear();

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      await userEvent.type(usernameInput, 'testuser');
      
      // Use userEvent.keyboard for Enter key
      await userEvent.keyboard('{Enter}');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
      expect(socket.emit).toHaveBeenCalledWith('joinGame', {
        gameId: 'test-game-123',
        username: 'testuser'
      });
    });
  });

  describe('Join Game Functionality', () => {
    test('should join game with valid username', async () => {
      renderJoinGame();
      
      // Clear localStorage mock calls that happened during component initialization
      mockLocalStorage.setItem.mockClear();

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const joinButton = screen.getByText('Join Game');

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.click(joinButton);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
      expect(socket.emit).toHaveBeenCalledWith('joinGame', {
        gameId: 'test-game-123',
        username: 'testuser'
      });
    });

    test('should show error for empty username', async () => {
      renderJoinGame();

      const joinButton = screen.getByText('Join Game');
      await userEvent.click(joinButton);

      expect(toast.error).toHaveBeenCalledWith('Please enter a username');
      expect(socket.emit).not.toHaveBeenCalled();
    });

    test('should show error for whitespace-only username', async () => {
      renderJoinGame();

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const joinButton = screen.getByText('Join Game');

      await userEvent.type(usernameInput, '   ');
      await userEvent.click(joinButton);

      expect(toast.error).toHaveBeenCalledWith('Please enter a username');
      expect(socket.emit).not.toHaveBeenCalled();
    });

    test('should trim username before validation', async () => {
      renderJoinGame();
      
      // Clear localStorage mock calls that happened during component initialization
      mockLocalStorage.setItem.mockClear();

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const joinButton = screen.getByText('Join Game');

      await userEvent.type(usernameInput, '  testuser  ');
      await userEvent.click(joinButton);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', '  testuser  ');
      expect(socket.emit).toHaveBeenCalledWith('joinGame', {
        gameId: 'test-game-123',
        username: '  testuser  '
      });
    });
  });

  describe('Socket Event Handling', () => {
    test('should handle usernameExists event', async () => {
      renderJoinGame();

      // Get the usernameExists event handler that was registered
      const usernameExistsHandler = socket.on.mock.calls.find(
        call => call[0] === 'usernameExists'
      )[1];

      // Set up username input
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      await userEvent.type(usernameInput, 'existinguser');

      // Simulate socket event
      usernameExistsHandler({ message: 'Username already exists' });

      expect(toast.error).toHaveBeenCalledWith('Username already exists');
      await waitFor(() => {
        expect(usernameInput).toHaveValue('');
      });
    });

    test('should handle joinSuccess event', async () => {
      renderJoinGame();

      // Get the joinSuccess event handler that was registered
      const joinSuccessHandler = socket.on.mock.calls.find(
        call => call[0] === 'joinSuccess'
      )[1];

      // Simulate successful join
      joinSuccessHandler({ gameId: 'test-game-123' });

      expect(mockNavigate).toHaveBeenCalledWith('/game/test-game-123');
    });

    test('should handle joinSuccess with different gameId', async () => {
      renderJoinGame();

      const joinSuccessHandler = socket.on.mock.calls.find(
        call => call[0] === 'joinSuccess'
      )[1];

      joinSuccessHandler({ gameId: 'different-game-456' });

      expect(mockNavigate).toHaveBeenCalledWith('/game/different-game-456');
    });
  });

  describe('Edge Cases', () => {
    test('should handle special characters in username', async () => {
      renderJoinGame();

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const joinButton = screen.getByText('Join Game');

      await userEvent.type(usernameInput, 'user@123!');
      await userEvent.click(joinButton);

      expect(socket.emit).toHaveBeenCalledWith('joinGame', {
        gameId: 'test-game-123',
        username: 'user@123!'
      });
    });

    test('should handle very long username', async () => {
      renderJoinGame();

      const longUsername = 'a'.repeat(100);
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const joinButton = screen.getByText('Join Game');

      await userEvent.type(usernameInput, longUsername);
      await userEvent.click(joinButton);

      expect(socket.emit).toHaveBeenCalledWith('joinGame', {
        gameId: 'test-game-123',
        username: longUsername
      });
    });
  });
});
