import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VotingCards from '../components/VotingCards';

describe('VotingCards', () => {
    const mockCards = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', '∞', '?'];
    const mockOnCardSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all cards', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        mockCards.forEach(card => {
            expect(screen.getByText(card)).toBeInTheDocument();
        });
    });

    test('displays correct title for voting state', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        expect(screen.getByText('Choose your estimate:')).toBeInTheDocument();
    });

    test('displays correct title for non-voting state', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="waiting"
                disabled={true}
            />
        );

        expect(screen.getByText('Estimation Cards')).toBeInTheDocument();
    });

    test('calls onCardSelect when card is clicked during voting', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        const cardButton = screen.getByText('5');
        fireEvent.click(cardButton);

        expect(mockOnCardSelect).toHaveBeenCalledWith('5');
    });

    test('does not call onCardSelect when disabled', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="waiting"
                disabled={true}
            />
        );

        const cardButton = screen.getByText('5');
        fireEvent.click(cardButton);

        expect(mockOnCardSelect).not.toHaveBeenCalled();
    });

    test('highlights selected card', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard="8"
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        const selectedCard = screen.getByText('8');
        const unselectedCard = screen.getByText('5');

        // Selected card should have specific styling
        expect(selectedCard).toHaveStyle('border: 3px solid #0068dfff');
        expect(selectedCard).toHaveStyle('background-color: #f0f8ff');

        // Unselected card should have default styling
        expect(unselectedCard).toHaveStyle('border: 2px solid #e0e0e0');
        expect(unselectedCard).toHaveStyle('background-color: white');
    });

    test('disables cards when disabled prop is true', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="waiting"
                disabled={true}
            />
        );

        mockCards.forEach(card => {
            const cardButton = screen.getByText(card);
            expect(cardButton).toBeDisabled();
        });
    });

    test('enables cards when disabled prop is false and gameState is voting', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        mockCards.forEach(card => {
            const cardButton = screen.getByText(card);
            expect(cardButton).not.toBeDisabled();
        });
    });

    test('displays correct status message for waiting state', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="waiting"
                disabled={true}
            />
        );

        expect(screen.getByText('Waiting for voting to start...')).toBeInTheDocument();
    });

    test('displays correct status message for voting state without selection', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        expect(screen.getByText('Click on a card to make your estimate')).toBeInTheDocument();
    });

    test('displays correct status message for voting state with selection', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard="13"
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        expect(screen.getByText('You selected: 13')).toBeInTheDocument();
    });

    test('displays correct status message for revealed state', () => {
        render(
            <VotingCards
                cards={mockCards}
                selectedCard="5"
                onCardSelect={mockOnCardSelect}
                gameState="revealed"
                disabled={true}
            />
        );

        expect(screen.getByText('Voting round completed')).toBeInTheDocument();
    });

    test('handles special characters in cards correctly', () => {
        const specialCards = ['∞', '?'];
        render(
            <VotingCards
                cards={specialCards}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        expect(screen.getByText('∞')).toBeInTheDocument();
        expect(screen.getByText('?')).toBeInTheDocument();
    });

    test('card buttons have correct dimensions and styling', () => {
        render(
            <VotingCards
                cards={['1', '2', '3']}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        const cardButton = screen.getByText('1');

        expect(cardButton).toHaveStyle('width: 60px');
        expect(cardButton).toHaveStyle('height: 80px');
        expect(cardButton).toHaveStyle('border-radius: 8px');
        expect(cardButton).toHaveStyle('font-size: 16px');
        expect(cardButton).toHaveStyle('font-weight: bold');
    });

    test('card hover effects work when enabled', () => {
        render(
            <VotingCards
                cards={['5']}
                selectedCard={null}
                onCardSelect={mockOnCardSelect}
                gameState="voting"
                disabled={false}
            />
        );

        const cardButton = screen.getByText('5');

        // Test mouse enter
        fireEvent.mouseEnter(cardButton);
        expect(cardButton).toHaveStyle('background-color: #f8f9fa');
        expect(cardButton).toHaveStyle('border-color: #51b1ffff');

        // Test mouse leave
        fireEvent.mouseLeave(cardButton);
        expect(cardButton).toHaveStyle('background-color: white');
        expect(cardButton).toHaveStyle('border-color: #e0e0e0');
    });
});
