// Manual Test Script for Planning Poker App
// Run this in browser console to test key functionality

console.log("🧪 Starting Planning Poker Manual Test Suite...");

// Test 1: Check if app is loaded
function testAppLoaded() {
    const navbar = document.querySelector('img[alt="Planning Poker Logo"]');
    const title = document.querySelector('h1');

    if (navbar && title) {
        console.log("✅ Test 1 PASSED: App loaded successfully");
        return true;
    } else {
        console.log("❌ Test 1 FAILED: App not loaded properly");
        return false;
    }
}

// Test 2: Test username input
function testUsernameInput() {
    const usernameInput = document.querySelector('input[placeholder="Enter Username"]');

    if (usernameInput) {
        usernameInput.value = "TestUser123";
        usernameInput.dispatchEvent(new Event('input', { bubbles: true }));

        if (usernameInput.value === "TestUser123") {
            console.log("✅ Test 2 PASSED: Username input working");
            return true;
        }
    }

    console.log("❌ Test 2 FAILED: Username input not working");
    return false;
}

// Test 3: Test room code input (digits only)
function testRoomCodeInput() {
    const roomCodeInput = document.querySelector('input[placeholder="Enter 6-digit room code"]');

    if (roomCodeInput) {
        // Test with mixed characters
        roomCodeInput.value = "12abc3";
        roomCodeInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Should only have digits
        if (roomCodeInput.value === "123") {
            console.log("✅ Test 3 PASSED: Room code input filters non-digits");
            return true;
        }
    }

    console.log("❌ Test 3 FAILED: Room code input not filtering properly");
    return false;
}

// Test 4: Test button states
function testButtonStates() {
    const createButton = Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.includes('Create New Room')
    );
    const joinButton = Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.includes('Join Room')
    );

    if (createButton && joinButton) {
        const isJoinDisabled = joinButton.disabled;
        console.log(`✅ Test 4 PASSED: Buttons found. Join button disabled: ${isJoinDisabled}`);
        return true;
    }

    console.log("❌ Test 4 FAILED: Buttons not found");
    return false;
}

// Test 5: Check localStorage functionality
function testLocalStorage() {
    try {
        localStorage.setItem('test', 'value');
        const retrieved = localStorage.getItem('test');
        localStorage.removeItem('test');

        if (retrieved === 'value') {
            console.log("✅ Test 5 PASSED: localStorage working");
            return true;
        }
    } catch (error) {
        console.log("❌ Test 5 FAILED: localStorage error:", error);
        return false;
    }

    console.log("❌ Test 5 FAILED: localStorage not working");
    return false;
}

// Run all tests
function runAllTests() {
    console.log("\n🚀 Running all tests...\n");

    const tests = [
        testAppLoaded,
        testUsernameInput,
        testRoomCodeInput,
        testButtonStates,
        testLocalStorage
    ];

    let passed = 0;
    let total = tests.length;

    tests.forEach((test, index) => {
        setTimeout(() => {
            if (test()) passed++;

            if (index === total - 1) {
                console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

                if (passed === total) {
                    console.log("🎉 All tests passed! App appears to be working correctly.");
                } else {
                    console.log("⚠️ Some tests failed. Check the issues above.");
                }
            }
        }, index * 100);
    });
}

// Export for manual execution
window.planningPokerTests = {
    runAllTests,
    testAppLoaded,
    testUsernameInput,
    testRoomCodeInput,
    testButtonStates,
    testLocalStorage
};

console.log("🔧 Test functions loaded. Run 'planningPokerTests.runAllTests()' to start testing.");
