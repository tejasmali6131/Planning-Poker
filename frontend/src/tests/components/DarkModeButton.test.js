import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DarkModeBtn from '../../components/DarkModeBtn';
import { renderComponent, clickButton } from '../testHelpers';

// Mock the DarkModeContext
const mockToggleDarkMode = jest.fn();
const mockUseDarkMode = jest.fn();

jest.mock('../../contexts/DarkModeContext', () => ({
  useDarkMode: () => mockUseDarkMode()
}));

describe('DarkModeBtn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render dark mode button', () => {
      mockUseDarkMode.mockReturnValue({
        isDarkMode: false,
        toggleDarkMode: mockToggleDarkMode
      });

      renderComponent(<DarkModeBtn />);

      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toBeInTheDocument();
    });

    test('should show moon icon in light mode', () => {
      mockUseDarkMode.mockReturnValue({
        isDarkMode: false,
        toggleDarkMode: mockToggleDarkMode
      });

      renderComponent(<DarkModeBtn />);

      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toHaveTextContent('☾'); // Moon symbol
    });

    test('should show sun icon in dark mode', () => {
      mockUseDarkMode.mockReturnValue({
        isDarkMode: true,
        toggleDarkMode: mockToggleDarkMode
      });

      renderComponent(<DarkModeBtn />);

      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toHaveTextContent('☀'); // Sun symbol
    });
  });

  describe('Interactions', () => {
    test('should call toggleDarkMode when clicked', async () => {
      mockUseDarkMode.mockReturnValue({
        isDarkMode: false,
        toggleDarkMode: mockToggleDarkMode
      });

      renderComponent(<DarkModeBtn />);

      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      await clickButton(button);

      expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('should have proper aria-label', () => {
      mockUseDarkMode.mockReturnValue({
        isDarkMode: false,
        toggleDarkMode: mockToggleDarkMode
      });

      renderComponent(<DarkModeBtn />);

      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
    });
  });
});
