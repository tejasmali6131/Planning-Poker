import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersList from '../../components/UsersList';

describe('UsersList Component', () => {
  const defaultProps = {
    players: [
      { username: 'Alice', hasVoted: false, vote: null },
      { username: 'Bob', hasVoted: true, vote: null },
      { username: 'Charlie', hasVoted: false, vote: 5 }
    ],
    currentUsername: 'Alice',
    gameState: 'voting'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render participants header with correct count', () => {
      render(<UsersList {...defaultProps} />);

      expect(screen.getByText('Participants (3)')).toBeInTheDocument();
    });

    test('should render all player names with avatars', () => {
      render(<UsersList {...defaultProps} />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument(); // Alice's avatar
      expect(screen.getByText('B')).toBeInTheDocument(); // Bob's avatar
      expect(screen.getByText('C')).toBeInTheDocument(); // Charlie's avatar
    });

    test('should render with empty players array', () => {
      const props = { ...defaultProps, players: [] };
      render(<UsersList {...props} />);

      expect(screen.getByText('Participants (0)')).toBeInTheDocument();
    });
  });

  describe('Current User Indication', () => {
    test('should show "(You)" indicator for current user only', () => {
      render(<UsersList {...defaultProps} />);

      expect(screen.getByText('(You)')).toBeInTheDocument();
      const bobText = screen.getByText('Bob');
      expect(bobText.textContent).not.toContain('(You)');
    });

    test('should handle different current user', () => {
      const props = { ...defaultProps, currentUsername: 'Bob' };
      render(<UsersList {...props} />);

      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('(You)')).toBeInTheDocument();
    });
  });

  describe('Voting State Display', () => {
    test('should show voting status indicators during voting phase', () => {
      render(<UsersList {...defaultProps} />);

      expect(screen.getByText('⏱')).toBeInTheDocument(); // Alice waiting
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks).toHaveLength(2); // Bob and Charlie voted
    });

    test('should determine voting status from hasVoted and vote properties', () => {
      const props = {
        ...defaultProps,
        players: [
          { username: 'User1', hasVoted: true, vote: null },
          { username: 'User2', vote: 8 }, // Has vote value
          { username: 'User3', hasVoted: false, vote: null }
        ]
      };
      render(<UsersList {...props} />);

      const checkmarks = screen.getAllByText('✓');
      const waiting = screen.getAllByText('⏱');
      expect(checkmarks).toHaveLength(2); // User1 and User2
      expect(waiting).toHaveLength(1); // User3
    });
  });

  describe('Revealed State Display', () => {
    test('should show vote values when game state is revealed', () => {
      const props = {
        ...defaultProps,
        gameState: 'revealed',
        players: [
          { username: 'Alice', hasVoted: true, vote: 3 },
          { username: 'Bob', hasVoted: true, vote: 5 },
          { username: 'Charlie', hasVoted: false, vote: null }
        ]
      };
      render(<UsersList {...props} />);

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.queryByText('✓')).not.toBeInTheDocument(); // No voting indicators
      expect(screen.queryByText('⏱')).not.toBeInTheDocument();
    });

    test('should handle special vote values', () => {
      const props = {
        ...defaultProps,
        gameState: 'revealed',
        players: [
          { username: 'Alice', hasVoted: true, vote: '?' },
          { username: 'Bob', hasVoted: true, vote: 0 }
        ]
      };
      render(<UsersList {...props} />);

      expect(screen.getByText('?')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Different Game States', () => {
    test('should not show voting indicators in non-voting states', () => {
      const props = { ...defaultProps, gameState: 'waiting' };
      render(<UsersList {...props} />);

      expect(screen.queryByText('✓')).not.toBeInTheDocument();
      expect(screen.queryByText('⏱')).not.toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument(); // Players still shown
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing currentUsername', () => {
      const props = { ...defaultProps, currentUsername: undefined };
      render(<UsersList {...props} />);

      expect(screen.queryByText('(You)')).not.toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    test('should use OR logic for hasVoted and vote value', () => {
      const props = {
        ...defaultProps,
        players: [
          { username: 'User1', hasVoted: true, vote: null }, // hasVoted true should show voted
          { username: 'User2', hasVoted: false, vote: 5 }, // vote value should show voted
          { username: 'User3', hasVoted: false, vote: null } // both false should show waiting
        ]
      };
      render(<UsersList {...props} />);

      const checkmarks = screen.getAllByText('✓');
      const waiting = screen.getAllByText('⏱');
      expect(checkmarks).toHaveLength(2); // User1 and User2
      expect(waiting).toHaveLength(1); // User3
    });
  });
});










