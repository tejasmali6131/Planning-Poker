# Backend Tests

This directory contains comprehensive unit tests for the Planning Poker backend application.

## Test Structure

### Unit Tests (`unit/`)
- **`games.test.js`** - Tests for the in-memory games data store (95%+ coverage)
- **`generateId.test.js`** - Tests for the ID generation utility (100% coverage)
- **`gameRoutes.test.js`** - Tests for Express API routes (85%+ coverage)
- **`socket.test.js`** - Tests for Socket.IO event handlers (75%+ coverage)
- **`moduleExports.test.js`** - Tests for module export validation

### Test Utilities
- **`testHelpers.js`** - Shared testing utilities and mock functions

## Coverage Target

The test suite is designed to achieve **70%+ overall coverage** with the following targets:
- Statements: 70%+
- Branches: 70%+
- Functions: 70%+
- Lines: 70%+

## Running Tests

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch
```

## Test Features

### Comprehensive Testing
- **Unit Tests**: Individual module testing with mocking
- **Performance Tests**: Execution time and memory usage validation
- **Edge Case Testing**: Null/undefined handling, invalid inputs
- **Statistical Analysis**: Uniqueness and distribution testing for ID generation
- **Security Testing**: Pattern analysis for generated IDs

### Mock Management
- Console output mocking to reduce test noise
- Dependency isolation with Jest mocks
- Automatic cleanup between test runs

### Test Helpers
The `testHelpers.js` module provides:
- Mock data generators (`createTestGame`, `createTestPlayer`)
- Socket.IO mocking utilities
- Performance measurement tools
- Random data generators
- Common assertion helpers

## Coverage Reports

After running `npm run test:coverage`, coverage reports are available in:
- **Console**: Summary statistics
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV File**: `coverage/lcov.info`

## Test Configuration

Tests are configured via `jest.config.js` in the backend root directory:
- Node.js test environment
- Coverage thresholds enforced
- HTML and LCOV report generation
- Test timeout: 10 seconds

## Adding New Tests

1. Create test files in the `unit/` directory
2. Use the `.test.js` naming convention
3. Import and use utilities from `testHelpers.js`
4. Include edge cases and performance considerations
5. Maintain the coverage standards

## Test Quality Guidelines

- **Isolation**: Each test should be independent
- **Coverage**: Aim for comprehensive code path coverage
- **Performance**: Include execution time and memory tests where relevant
- **Edge Cases**: Test boundary conditions and error scenarios
- **Documentation**: Clear test descriptions and comments
