# Planning Poker Backend - Unit Tests

## Overview
This directory contains comprehensive unit tests for the Planning Poker backend application, designed to achieve at least 70% code coverage.

## Test Structure

```
tests/
├── unit/                      # Unit tests
│   ├── generateId.test.js     # Tests for ID generation utility
│   ├── games.test.js          # Tests for games data module
│   ├── gameRoutes.test.js     # Tests for API routes
│   ├── socket.test.js         # Tests for Socket.IO functionality
│   └── moduleExports.test.js  # Tests for module exports and structure
└── testHelpers.js             # Shared test utilities
```

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Coverage

The test suite aims for at least 70% coverage across:
- **Lines**: 70%+
- **Functions**: 70%+
- **Branches**: 70%+
- **Statements**: 70%+

### Coverage Reports
Coverage reports are generated in multiple formats:
- **Terminal**: Summary displayed after running `npm run test:coverage`
- **HTML**: Detailed report in `coverage/lcov-report/index.html`
- **LCOV**: Machine-readable format in `coverage/lcov.info`

## Test Categories

### 1. Unit Tests (`tests/unit/`)

#### `generateId.test.js`
Tests the game ID generation utility:
- ✅ ID format and length validation
- ✅ Uniqueness verification  
- ✅ Performance under load
- ✅ Error handling

#### `games.test.js`
Tests the in-memory games data store:
- ✅ CRUD operations
- ✅ Data integrity
- ✅ Reference handling
- ✅ Multiple game management

#### `gameRoutes.test.js`
Tests the Express API routes:
- ✅ Game creation endpoint
- ✅ Game retrieval endpoint
- ✅ Error responses (404, 500)
- ✅ Input validation
- ✅ Response formats

#### `socket.test.js`
Tests Socket.IO event handlers:
- ✅ Connection handling
- ✅ Game joining logic
- ✅ Vote management
- ✅ Game state updates
- ✅ Player disconnection
- ✅ Error scenarios

#### `moduleExports.test.js`
Tests module structure and dependencies:
- ✅ Proper exports
- ✅ File structure validation
- ✅ Configuration verification

## Test Utilities

### `testHelpers.js`
Provides shared utilities:
- Mock data generators
- Assertion helpers
- Console output management
- Async test utilities

## Mock Strategy

Tests use Jest mocking for:
- **External dependencies**: `nanoid`, `express`
- **Internal modules**: Games data store
- **Console output**: Reduced noise during testing
- **Socket.IO**: Controlled event simulation

## Best Practices

### Test Organization
- One test file per module
- Descriptive test names
- Grouped related tests with `describe`
- Setup/teardown in `beforeEach`/`afterEach`

### Test Quality
- Tests are isolated and independent
- No external dependencies (databases, networks)
- Fast execution (all tests run in <5 seconds)
- Clear assertions with meaningful error messages

### Coverage Goals
- Focus on critical business logic
- Test error conditions and edge cases
- Verify input validation
- Ensure proper state management

## CI/CD Integration

Tests are designed to integrate with CI/CD pipelines:
```bash
# In CI pipeline
npm ci
npm run test:coverage
```

Coverage thresholds will fail the build if not met.

## Debugging Tests

### Run Individual Test Files
```bash
npx jest tests/unit/generateId.test.js
```

### Debug Specific Tests
```bash
npx jest --testNamePattern="should generate unique IDs"
```

### Verbose Output
```bash
npx jest --verbose
```

## Contributing

When adding new functionality:
1. Write tests first (TDD)
2. Ensure coverage remains above 70%
3. Update this README if needed
4. Run full test suite before committing

## Performance

Current test suite:
- **Total tests**: ~50+ test cases
- **Execution time**: <5 seconds
- **Coverage**: 70%+ (target)
- **Files tested**: All backend modules
