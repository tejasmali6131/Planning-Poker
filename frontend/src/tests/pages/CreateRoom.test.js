import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CreateRoom from '../../pages/CreateRoom';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123456'
}));

jest.mock('../../components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

const mockNavigate = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock alert
window.alert = jest.fn();

const renderCreateRoom = () => {
  return render(
    <BrowserRouter>
      <CreateRoom />
    </BrowserRouter>
  );
};

describe('CreateRoom Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.setItem.mockReset();
    window.alert.mockReset();
    
    // Mock timers for setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Authentication and Navigation', () => {
    test('should redirect to home if no username in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      renderCreateRoom();
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('should render component if username exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('testuser');
      
      renderCreateRoom();
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByText('Create Planning Room')).toBeInTheDocument();
    });

    test('should navigate back to home when back button is clicked', async () => {
      mockLocalStorage.getItem.mockReturnValue('testuser');
      
      renderCreateRoom();
      
      const backButton = screen.getByText('Back');
      await userEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Form Elements and UI', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('testuser');
    });

    test('should render all form elements', () => {
      renderCreateRoom();
      
      expect(screen.getByText('Room Name *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter room name/)).toBeInTheDocument();
      expect(screen.getByText('Deck Type')).toBeInTheDocument();
      expect(screen.getByText('Fibonacci')).toBeInTheDocument();
      expect(screen.getByText('Modified Fibonacci')).toBeInTheDocument();
      expect(screen.getByText('Create Room')).toBeInTheDocument();
    });

    test('should display both deck types with cards preview', () => {
      renderCreateRoom();
      
      // Check Fibonacci deck
      expect(screen.getByText('Fibonacci')).toBeInTheDocument();
      expect(screen.getByText('21')).toBeInTheDocument(); // Unique to Fibonacci
      expect(screen.getByText('34')).toBeInTheDocument(); // Unique to Fibonacci  
      
      // Check Modified Fibonacci deck
      expect(screen.getByText('Modified Fibonacci')).toBeInTheDocument();
      expect(screen.getByText('½')).toBeInTheDocument(); // Unique to Modified Fibonacci
      expect(screen.getByText('20')).toBeInTheDocument(); // Unique to Modified Fibonacci
    });

    test('should have Fibonacci deck selected by default', () => {
      renderCreateRoom();
      
      // Check that Fibonacci deck text is present and the first radio button is checked
      expect(screen.getByText('Fibonacci')).toBeInTheDocument();
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons[0]).toBeChecked(); // First radio button should be checked (Fibonacci)
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('testuser');
    });

    test('should update room name input', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, 'Test Room');
      
      expect(roomNameInput).toHaveValue('Test Room');
    });

    test('should change deck type selection', async () => {
      renderCreateRoom();
      
      const radioButtons = screen.getAllByRole('radio');
      const modifiedFibRadio = radioButtons[1]; // Modified Fibonacci is the second option
      await userEvent.click(modifiedFibRadio);
      
      expect(modifiedFibRadio).toBeChecked();
    });

    test('should disable create button when room name is empty', () => {
      renderCreateRoom();
      
      const createButton = screen.getByText('Create Room');
      expect(createButton).toBeDisabled();
    });

    test('should enable create button when room name is provided', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, 'Test Room');
      
      const createButton = screen.getByText('Create Room');
      expect(createButton).toBeEnabled();
    });
  });

  describe('Room Creation', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('testuser');
    });

    test('should disable create button when room name is empty', () => {
      renderCreateRoom();
      
      const createButton = screen.getByText('Create Room');
      expect(createButton).toBeDisabled();
    });

    test('should enable create button when room name is provided', () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/enter room name/i);
      const createButton = screen.getByText('Create Room');
      
      // Initially disabled
      expect(createButton).toBeDisabled();
      
      // Type room name
      fireEvent.change(roomNameInput, { target: { value: 'Test Room' } });
      
      // Should be enabled now
      expect(createButton).not.toBeDisabled();
    });

    test('should keep button disabled when room name is empty', () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/enter room name/i);
      const createButton = screen.getByText('Create Room');
      
      // Set empty room name
      fireEvent.change(roomNameInput, { target: { value: '' } });
      
      // Button should remain disabled for empty room name
      expect(createButton).toBeDisabled();
      
      // Verify that clicking the disabled button doesn't trigger anything
      fireEvent.click(createButton);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('should create room and navigate when form is valid', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, 'Test Room');
      
      const createButton = screen.getByText('Create Room');
      await userEvent.click(createButton);
      
      // Check that localStorage.setItem was called with room data
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'room_test-u',
        expect.stringContaining('"name":"Test Room"')
      );
      
      // Check navigation after timeout
      jest.advanceTimersByTime(500);
      expect(mockNavigate).toHaveBeenCalledWith('/game/test-u');
    });

    test('should store correct room configuration in localStorage', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, 'Sprint Planning');
      
      // Select Modified Fibonacci (second radio button)
      const radioButtons = screen.getAllByRole('radio');
      await userEvent.click(radioButtons[1]); // Modified Fibonacci is the second option
      
      const createButton = screen.getByText('Create Room');
      await userEvent.click(createButton);
      
      // Verify localStorage call
      const setItemCall = mockLocalStorage.setItem.mock.calls[0];
      expect(setItemCall[0]).toBe('room_test-u');
      
      const roomData = JSON.parse(setItemCall[1]);
      expect(roomData.name).toBe('Sprint Planning');
      expect(roomData.deckType).toBe('MODIFIED_FIBONACCI');
      expect(roomData.cards).toEqual(["0", "½", "1", "2", "3", "5", "8", "13", "20", "?"]);
      expect(roomData.createdBy).toBe('testuser');
      expect(roomData.createdAt).toBeDefined();
    });

    test('should handle Enter key press in room name input', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, 'Test Room{enter}');
      
      // Should trigger room creation
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      
      jest.advanceTimersByTime(500);
      expect(mockNavigate).toHaveBeenCalledWith('/game/test-u');
    });
  });

  describe('Loading States', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('testuser');
    });

    test('should show loading state during room creation', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, 'Test Room');
      
      const createButton = screen.getByText('Create Room');
      await userEvent.click(createButton);
      
      // Should show loading text
      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(screen.getByText('Creating...')).toBeDisabled();
    });

    test('should disable create button during creation', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, 'Test Room');
      
      const createButton = screen.getByText('Create Room');
      await userEvent.click(createButton);
      
      const creatingButton = screen.getByText('Creating...');
      expect(creatingButton).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('testuser');
    });

    test('should trim whitespace from room name', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, '   ');
      
      const createButton = screen.getByText('Create Room');
      expect(createButton).toBeDisabled();
    });

    test('should handle room name with only spaces as invalid', async () => {
      renderCreateRoom();
      
      const roomNameInput = screen.getByPlaceholderText(/Enter room name/);
      await userEvent.type(roomNameInput, '   ');
      
      // Button should be disabled when room name contains only spaces
      const createButton = screen.getByText('Create Room');
      expect(createButton).toBeDisabled();
      
      // Verify the input contains the spaces but button remains disabled
      expect(roomNameInput.value).toBe('   ');
    });
  });
});
