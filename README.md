# Planning Poker Pro

A full-stack Planning Poker application built with React (frontend) and Node.js/Express (backend).

## Quick Start

To run both backend and frontend together with a single command:

```bash
npm start
```

This will start:
- Backend server on `http://localhost:4000`
- Frontend development server on `http://localhost:3000`

## Installation

### Option 1: Install all dependencies at once
```bash
npm run install:all
```

### Option 2: Install manually
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install
```

## Available Scripts

In the project root directory, you can run:

### `npm start`

Runs both the backend and frontend servers concurrently:
- Backend (Node.js/Express) on `http://localhost:4000`
- Frontend (React) on `http://localhost:3000`

### `npm run start:backend`

Runs only the backend server in development mode with nodemon for auto-restart.

### `npm run start:frontend`

Runs only the frontend React app in development mode.

### `npm run build`

Builds the frontend app for production to the `build` folder.

### `npm test`

Runs tests for both backend and frontend concurrently.

### `npm run test:coverage`

Runs test coverage reports for both backend and frontend.

### `npm run install:all`

Installs dependencies for root, backend, and frontend projects.

### `npm run clean`

Removes all node_modules folders from root, backend, and frontend.

## Docker Support

You can also run the application using Docker:

```bash
# Start with Docker Compose
npm run docker:up

# Stop Docker containers
npm run docker:down

# Build Docker images
npm run docker:build
```

## Development

### Backend Development
The backend is built with:
- Node.js & Express
- Socket.io for real-time communication
- Jest for testing

### Frontend Development
The frontend is built with:
- React
- Socket.io-client for real-time communication
- React Testing Library & Jest for testing

## Learn More

### React Documentation
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Node.js & Express
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)

### Socket.io
- [Socket.io Documentation](https://socket.io/docs/)

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
