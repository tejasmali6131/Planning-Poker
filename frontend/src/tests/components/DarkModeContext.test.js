import { renderHook, act } from '@testing-library/react';
import { DarkModeProvider, useDarkMode } from '../../contexts/DarkModeContext';
import { mockLocalStorage } from '../testHelpers';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('DarkModeContext', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    
    // Clear document classes
    document.documentElement.classList.remove('dark-mode');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Provider', () => {
    test('should provide dark mode context', () => {
      const wrapper = ({ children }) => (
        <DarkModeProvider>{children}</DarkModeProvider>
      );

      const { result } = renderHook(() => useDarkMode(), { wrapper });

      expect(result.current.isDarkMode).toBeDefined();
      expect(result.current.toggleDarkMode).toBeDefined();
      expect(typeof result.current.toggleDarkMode).toBe('function');
    });

    test('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useDarkMode());
      }).toThrow('useDarkMode must be used within a DarkModeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Initial State', () => {
    test('should initialize with light mode by default', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const wrapper = ({ children }) => (
        <DarkModeProvider>{children}</DarkModeProvider>
      );

      const { result } = renderHook(() => useDarkMode(), { wrapper });

      expect(result.current.isDarkMode).toBe(false);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    });

    test('should initialize with dark mode when saved in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('true');

      const wrapper = ({ children }) => (
        <DarkModeProvider>{children}</DarkModeProvider>
      );

      const { result } = renderHook(() => useDarkMode(), { wrapper });

      expect(result.current.isDarkMode).toBe(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    });
  });

  describe('Toggle Functionality', () => {
    test('should toggle from light to dark mode', () => {
      mockLocalStorage.getItem.mockReturnValue('false');

      const wrapper = ({ children }) => (
        <DarkModeProvider>{children}</DarkModeProvider>
      );

      const { result } = renderHook(() => useDarkMode(), { wrapper });

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDarkMode).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith('darkMode', true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    });

    test('should toggle from dark to light mode', () => {
      mockLocalStorage.getItem.mockReturnValue('true');

      const wrapper = ({ children }) => (
        <DarkModeProvider>{children}</DarkModeProvider>
      );

      const { result } = renderHook(() => useDarkMode(), { wrapper });

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDarkMode).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith('darkMode', false);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    });
  });
});
