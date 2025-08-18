# Planning Poker Application

A real-time planning poker application built with React and Socket.IO for agile estimation sessions.

## Features

- ✅ Create and join planning rooms with 6-digit codes
- ✅ Multiple deck types (Fibonacci, Modified Fibonacci, T-Shirt sizes, Powers of 2)
- ✅ Real-time voting with WebSocket support
- ✅ Automatic average calculation and closest card suggestion
- ✅ Dark mode support
- ✅ Responsive design with KONE company branding
- ✅ Local storage for room persistence
- ✅ Copy room link functionality
- ✅ Comprehensive unit tests

## Technology Stack

- **Frontend**: React 19, React Router DOM
- **Backend**: Node.js, Express, Socket.IO
- **Styling**: Inline styles with CSS animations
- **Testing**: React Testing Library, Jest
- **Storage**: LocalStorage (with cross-tab synchronization)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd planning-poker
   ```

2. **Install client dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Client Only (with local storage)
```bash
# Run the React development server
npm start
```
This will start the application on `http://localhost:3000` (or next available port).

#### Option 2: Full Application with Real-time Features
```bash
# Terminal 1: Start the Socket.IO server
cd server
npm start

# Terminal 2: Start the React client
npm start
```

- Server runs on: `http://localhost:3001`
- Client runs on: `http://localhost:3000`

### Using Command Prompt (Windows)

If you encounter PowerShell execution policy issues:

```cmd
REM Start server
cd server
cmd /c "npm start"

REM In another terminal, start client
cmd /c "npm start"
```

## How to Use

### Creating a Room

1. Enter your username
2. Click "Create New Room"
3. Customize room name and select deck type
4. Click "Create Room"
5. Share the generated 6-digit room code with team members

### Joining a Room

1. Enter your username
2. Enter the 6-digit room code
3. Click "Join Room"

### Estimation Process

1. **Room Creator** clicks "Start Voting" when everyone has joined
2. **All participants** select their estimation cards
3. **Room Creator** clicks "Reveal Votes" when everyone has voted
4. Review results and start a new round if needed

## Room Codes & Cross-Browser Access

The application now supports sharing rooms across different browser instances:

- **Local Storage**: Rooms are stored locally in your browser
- **Cross-Tab Sync**: Room updates are synchronized across tabs in the same browser
- **Demo Rooms**: If a room code doesn't exist, a demo room is created automatically for testing

### For True Cross-Browser Support

To enable real-time features across different browsers and devices:

1. Start the Socket.IO server (see installation instructions above)
2. The server will handle room management and real-time synchronization
3. All users can join the same room from different browsers/devices

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
