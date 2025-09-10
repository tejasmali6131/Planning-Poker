// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toBeInTheDocument();
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock navigator.clipboard
const mockWriteText = jest.fn(() => Promise.resolve());
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

// Export the mock for use in tests
global.mockWriteText = mockWriteText;
