import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VotingCards from '../../components/VotingCards';
import { renderWithProviders, clickButton } from '../testHelpers';

describe('VotingCards Component', () => {
  const defaultProps = {
    cards: ['0', '1', '2', '3', '5', '8', '13', '21', '?'],
    selectedCard: null,
    onCardSelect: jest.fn(),
    gameState: 'voting',
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render voting cards with correct title', () => {
      renderWithProviders(<VotingCards {...defaultProps} />);

      expect(screen.getByText('Select a card:')).toBeInTheDocument();
    });

    test('should render all provided cards', () => {
      renderWithProviders(<VotingCards {...defaultProps} />);

      defaultProps.cards.forEach(card => {
        expect(screen.getByText(card)).toBeInTheDocument();
      });
    });

    test('should show different title when not voting', () => {
      const props = { ...defaultProps, gameState: 'waiting' };
      renderWithProviders(<VotingCards {...props} />);

      expect(screen.getByText('Estimation Cards')).toBeInTheDocument();
    });

    test('should render with empty cards array', () => {
      const props = { ...defaultProps, cards: [] };
      renderWithProviders(<VotingCards {...props} />);

      expect(screen.getByText('Select a card:')).toBeInTheDocument();
    });
  });

  describe('Card Selection', () => {
    test('should highlight selected card', () => {
      const props = { ...defaultProps, selectedCard: '5' };
      renderWithProviders(<VotingCards {...props} />);

      const selectedCardButton = screen.getByRole('button', { name: '5' });
      expect(selectedCardButton).toHaveClass('selected');
      expect(selectedCardButton).toHaveClass('voting-card');
    });

    test('should call onCardSelect when card is clicked', async () => {
      renderWithProviders(<VotingCards {...defaultProps} />);

      const cardButton = screen.getByRole('button', { name: '3' });
      await clickButton(cardButton);

      expect(defaultProps.onCardSelect).toHaveBeenCalledWith('3');
      expect(defaultProps.onCardSelect).toHaveBeenCalledTimes(1);
    });

    test('should not call onCardSelect when disabled', async () => {
      const props = { ...defaultProps, disabled: true };
      renderWithProviders(<VotingCards {...props} />);

      const cardButton = screen.getByRole('button', { name: '3' });
      await clickButton(cardButton);

      expect(defaultProps.onCardSelect).not.toHaveBeenCalled();
    });

    test('should not call onCardSelect when not in voting state', async () => {
      const props = { ...defaultProps, gameState: 'revealed' };
      renderWithProviders(<VotingCards {...props} />);

      const cardButton = screen.getByRole('button', { name: '3' });
      await clickButton(cardButton);

      expect(defaultProps.onCardSelect).not.toHaveBeenCalled();
    });
  });

  describe('Card States', () => {
    test('should disable all cards when disabled prop is true', () => {
      const props = { ...defaultProps, disabled: true };
      renderWithProviders(<VotingCards {...props} />);

      defaultProps.cards.forEach(card => {
        const cardButton = screen.getByRole('button', { name: card });
        expect(cardButton).toBeDisabled();
      });
    });

    test('should enable cards when in voting state and not disabled', () => {
      renderWithProviders(<VotingCards {...defaultProps} />);

      defaultProps.cards.forEach(card => {
        const cardButton = screen.getByRole('button', { name: card });
        expect(cardButton).not.toBeDisabled();
      });
    });

    test('should disable cards when not in voting state', () => {
      const props = { ...defaultProps, gameState: 'waiting' };
      renderWithProviders(<VotingCards {...props} />);

      defaultProps.cards.forEach(card => {
        const cardButton = screen.getByRole('button', { name: card });
        // Cards should not have the 'clickable' class when not in voting state
        expect(cardButton).not.toHaveClass('clickable');
      });
    });
  });

  describe('Styling', () => {
    test('should apply correct styling to unselected cards', () => {
      renderWithProviders(<VotingCards {...defaultProps} />);

      const cardButton = screen.getByRole('button', { name: '1' });
      expect(cardButton).toHaveClass('voting-card');
      expect(cardButton).not.toHaveClass('selected');
      expect(cardButton).not.toHaveClass('disabled');
    });

    test('should apply correct styling to selected card', () => {
      const props = { ...defaultProps, selectedCard: '8' };
      renderWithProviders(<VotingCards {...props} />);

      const selectedCardButton = screen.getByRole('button', { name: '8' });
      expect(selectedCardButton).toHaveClass('selected');
      expect(selectedCardButton).toHaveClass('voting-card');
    });

    test('should apply disabled styling when cards are disabled', () => {
      const props = { ...defaultProps, disabled: true };
      renderWithProviders(<VotingCards {...props} />);

      const cardButton = screen.getByRole('button', { name: '1' });
      expect(cardButton).toHaveClass('disabled');
      expect(cardButton).toHaveClass('voting-card');
      expect(cardButton).toBeDisabled();
    });
  });

  describe('Different Card Sets', () => {
    test('should render fibonacci cards', () => {
      const fibonacciCards = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?'];
      const props = { ...defaultProps, cards: fibonacciCards };
      renderWithProviders(<VotingCards {...props} />);

      fibonacciCards.forEach(card => {
        expect(screen.getByRole('button', { name: card })).toBeInTheDocument();
      });
    });

    test('should render modified fibonacci cards', () => {
      const modifiedFibCards = ['0', '½', '1', '2', '3', '5', '8', '13', '20', '?'];
      const props = { ...defaultProps, cards: modifiedFibCards };
      renderWithProviders(<VotingCards {...props} />);

      modifiedFibCards.forEach(card => {
        expect(screen.getByRole('button', { name: card })).toBeInTheDocument();
      });
    });

    test('should handle special characters in cards', () => {
      const specialCards = ['?', '∞', '☕', '½'];
      const props = { ...defaultProps, cards: specialCards };
      renderWithProviders(<VotingCards {...props} />);

      specialCards.forEach(card => {
        expect(screen.getByRole('button', { name: card })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper button roles for all cards', () => {
      renderWithProviders(<VotingCards {...defaultProps} />);

      defaultProps.cards.forEach(card => {
        const cardButton = screen.getByRole('button', { name: card });
        expect(cardButton).toBeInTheDocument();
        expect(cardButton.tagName).toBe('BUTTON');
      });
    });

    test('should be keyboard navigable', () => {
      renderWithProviders(<VotingCards {...defaultProps} />);

      const firstCard = screen.getByRole('button', { name: '0' });
      const secondCard = screen.getByRole('button', { name: '1' });

      firstCard.focus();
      expect(firstCard).toHaveFocus();

      secondCard.focus();
      expect(secondCard).toHaveFocus();
    });
  });
});
