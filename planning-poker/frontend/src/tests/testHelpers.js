import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Helper to render components with Router
export const renderWithRouter = (component, { initialEntries = ['/'] } = {}) => {
  return render(
    <BrowserRouter>{component}</BrowserRouter>
  );
};

// Mock navigate function
export const mockNavigate = jest.fn();

// Setup common mocks
export const setupCommonMocks = () => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });

  // Mock react-router-dom
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  // Mock uuid
  jest.mock('uuid', () => ({
    v4: () => 'test-uuid-123456'
  }));

  // Mock alert
  window.alert = jest.fn();

  // Mock setTimeout
  jest.useFakeTimers();
};

// Reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  mockNavigate.mockReset();
  mockLocalStorage.getItem.mockReset();
  mockLocalStorage.setItem.mockReset();
  mockLocalStorage.removeItem.mockReset();
  mockLocalStorage.clear.mockReset();
  if (window.alert) {
    window.alert.mockReset();
  }
};
