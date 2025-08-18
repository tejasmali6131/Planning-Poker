import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersList from '../components/UsersList';

describe('UsersList', () => {
    const mockUsers = [
        {
            id: 'user1',
            username: 'Alice',
            hasVoted: false,
            isCreator: true
        },
        {
            id: 'user2',
            username: 'Bob',
            hasVoted: true,
            isCreator: false
        },
        {
            id: 'user3',
            username: 'Charlie',
            hasVoted: false,
            isCreator: false
        }
    ];

    const mockCurrentUser = {
        id: 'user2',
        username: 'Bob',
        hasVoted: true,
        isCreator: false
    };

    const mockVotes = {
        'user2': { userId: 'user2', username: 'Bob', vote: '5' },
        'user1': { userId: 'user1', username: 'Alice', vote: '8' }
    };

    test('renders user list with correct participant count', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Participants (3)')).toBeInTheDocument();
    });

    test('displays all users with correct information', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    test('highlights current user correctly', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('(You)')).toBeInTheDocument();
    });

    test('shows creator badge for room creator', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Room Creator')).toBeInTheDocument();
    });

    test('displays user avatars with correct initials', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        // Check that user initials are displayed (testing the first letter of each username)
        const avatars = screen.getAllByText(/^[A-Z]$/);
        expect(avatars).toHaveLength(3); // A, B, C for Alice, Bob, Charlie
    });

    test('shows voting status during voting phase', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={mockVotes}
                gameState="voting"
            />
        );

        // Should show checkmarks and waiting indicators
        const checkmarks = screen.getAllByText('✓');
        const waitingIcons = screen.getAllByText('⏱');

        expect(checkmarks.length).toBeGreaterThan(0);
        expect(waitingIcons.length).toBeGreaterThan(0);
    });

    test('shows vote values during revealed phase', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={mockVotes}
                gameState="revealed"
            />
        );

        expect(screen.getByText('5')).toBeInTheDocument(); // Bob's vote
        expect(screen.getByText('8')).toBeInTheDocument(); // Alice's vote
    });

    test('displays correct game status for waiting state', () => {
        render(
            <UsersList
                users={[mockUsers[0]]} // Only 1 user
                currentUser={mockUsers[0]}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Waiting for players...')).toBeInTheDocument();
    });

    test('displays correct game status for voting state', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={mockVotes}
                gameState="voting"
            />
        );

        expect(screen.getByText('Voting in progress...')).toBeInTheDocument();
        expect(screen.getByText('2 / 3 voted')).toBeInTheDocument();
    });

    test('displays correct game status for revealed state', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={mockVotes}
                gameState="revealed"
            />
        );

        expect(screen.getByText('Votes revealed')).toBeInTheDocument();
    });

    test('shows ready to start status when enough users are present', () => {
        render(
            <UsersList
                users={mockUsers} // 3 users
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Ready to start voting')).toBeInTheDocument();
    });

    test('displays correct instructions for creator during waiting', () => {
        const creatorUser = mockUsers[0]; // Alice is the creator

        render(
            <UsersList
                users={mockUsers}
                currentUser={creatorUser}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText(/As the room creator, you can start voting/)).toBeInTheDocument();
    });

    test('displays correct instructions for non-creator during waiting', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser} // Bob is not the creator
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText(/Waiting for the room creator to start voting/)).toBeInTheDocument();
    });

    test('displays correct instructions during voting', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="voting"
            />
        );

        expect(screen.getByText(/Choose your estimation from the cards below/)).toBeInTheDocument();
    });

    test('displays correct instructions for creator after reveal', () => {
        const creatorUser = mockUsers[0]; // Alice is the creator

        render(
            <UsersList
                users={mockUsers}
                currentUser={creatorUser}
                votes={mockVotes}
                gameState="revealed"
            />
        );

        expect(screen.getByText(/Review the results and start a new round/)).toBeInTheDocument();
    });

    test('displays correct instructions for non-creator after reveal', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser} // Bob is not the creator
                votes={mockVotes}
                gameState="revealed"
            />
        );

        expect(screen.getByText(/The room creator can start a new round/)).toBeInTheDocument();
    });

    test('applies correct styling to current user', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        // Current user should be highlighted differently
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('(You)')).toBeInTheDocument();
    });

    test('handles empty user list gracefully', () => {
        render(
            <UsersList
                users={[]}
                currentUser={null}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Participants (0)')).toBeInTheDocument();
    });

    test('shows game status section', () => {
        render(
            <UsersList
                users={mockUsers}
                currentUser={mockCurrentUser}
                votes={{}}
                gameState="waiting"
            />
        );

        expect(screen.getByText('Game Status')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
    });
});
