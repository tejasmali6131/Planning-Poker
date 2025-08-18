import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from '../HomePage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

const renderHomePage = () => {
    return render(
        <BrowserRouter>
            <HomePage />
        </BrowserRouter>
    );
};

describe('HomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders welcome message and input fields', () => {
        renderHomePage();

        expect(screen.getByText('Welcome to Planning Poker!!')).toBeInTheDocument();
        expect(screen.getByText('Estimate with your team in real-time')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter 6-digit room code')).toBeInTheDocument();
        expect(screen.getByText('Create New Room')).toBeInTheDocument();
        expect(screen.getByText('Join Room')).toBeInTheDocument();
    });

    test('updates username input field', () => {
        renderHomePage();

        const usernameInput = screen.getByPlaceholderText('Enter Username');
        fireEvent.change(usernameInput, { target: { value: 'TestUser' } });

        expect(usernameInput.value).toBe('TestUser');
    });

    test('updates room code input field with only digits', () => {
        renderHomePage();

        const roomCodeInput = screen.getByPlaceholderText('Enter 6-digit room code');

        // Test with valid digits
        fireEvent.change(roomCodeInput, { target: { value: '123456' } });
        expect(roomCodeInput.value).toBe('123456');

        // Test with non-digits (should be filtered out)
        fireEvent.change(roomCodeInput, { target: { value: '12ab34' } });
        expect(roomCodeInput.value).toBe('1234');
    });

    test('limits room code to 6 characters', () => {
        renderHomePage();

        const roomCodeInput = screen.getByPlaceholderText('Enter 6-digit room code');
        fireEvent.change(roomCodeInput, { target: { value: '1234567890' } });

        expect(roomCodeInput.value.length).toBeLessThanOrEqual(6);
    });

    test('create room button navigates when username is provided', async () => {
        renderHomePage();

        const usernameInput = screen.getByPlaceholderText('Enter Username');
        const createButton = screen.getByText('Create New Room');

        fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', 'TestUser');
        });
        expect(mockNavigate).toHaveBeenCalledWith('/create-room');
    });

    test('create room button shows alert when username is empty', () => {
        window.alert = jest.fn();
        renderHomePage();

        const createButton = screen.getByText('Create New Room');
        fireEvent.click(createButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter a username');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('join room button navigates when username and room code are valid', async () => {
        renderHomePage();

        const usernameInput = screen.getByPlaceholderText('Enter Username');
        const roomCodeInput = screen.getByPlaceholderText('Enter 6-digit room code');
        const joinButton = screen.getByText('Join Room');

        fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
        fireEvent.change(roomCodeInput, { target: { value: '123456' } });
        fireEvent.click(joinButton);

        await waitFor(() => {
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', 'TestUser');
        });
        expect(mockNavigate).toHaveBeenCalledWith('/room/123456');
    });

    test('join room button shows alert when username is empty', () => {
        window.alert = jest.fn();
        renderHomePage();

        const roomCodeInput = screen.getByPlaceholderText('Enter 6-digit room code');
        const joinButton = screen.getByText('Join Room');

        fireEvent.change(roomCodeInput, { target: { value: '123456' } });
        fireEvent.click(joinButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter a username');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('join room button shows alert when room code is invalid', () => {
        window.alert = jest.fn();
        renderHomePage();

        const usernameInput = screen.getByPlaceholderText('Enter Username');
        const roomCodeInput = screen.getByPlaceholderText('Enter 6-digit room code');
        const joinButton = screen.getByText('Join Room');

        fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
        fireEvent.change(roomCodeInput, { target: { value: '12345' } }); // Only 5 digits
        fireEvent.click(joinButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter a valid 6-digit room code');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('join room button is disabled when room code is not 6 digits', () => {
        renderHomePage();

        const joinButton = screen.getByText('Join Room');

        // Should be disabled initially
        expect(joinButton).toBeDisabled();

        // Should remain disabled with less than 6 digits
        const roomCodeInput = screen.getByPlaceholderText('Enter 6-digit room code');
        fireEvent.change(roomCodeInput, { target: { value: '12345' } });
        expect(joinButton).toBeDisabled();

        // Should be enabled with exactly 6 digits
        fireEvent.change(roomCodeInput, { target: { value: '123456' } });
        expect(joinButton).not.toBeDisabled();
    });

    test('input fields have correct styling and focus behavior', () => {
        renderHomePage();

        const usernameInput = screen.getByPlaceholderText('Enter Username');
        const roomCodeInput = screen.getByPlaceholderText('Enter 6-digit room code');

        // Check initial border colors
        expect(usernameInput).toHaveStyle('border: 2px solid #0068dfff');
        expect(roomCodeInput).toHaveStyle('border: 2px solid #51b1ffff');

        // Test focus behavior
        fireEvent.focus(usernameInput);
        expect(usernameInput).toHaveStyle('border-color: #004798ff');

        fireEvent.blur(usernameInput);
        expect(usernameInput).toHaveStyle('border-color: #0068dfff');
    });
});
