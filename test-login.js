// Simple test file to debug login
console.log('Test login script loaded');

// Test the login directly
async function testLogin() {
    const testData = {
        username: 'sirg.researchgroup@gmail.com',
        password: 'Lnmiit@14Jaipur'
    };
    
    console.log('Testing login with:', testData);
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            alert('Login test successful! Token: ' + data.token);
        } else {
            alert('Login test failed: ' + data.error);
        }
    } catch (error) {
        alert('Test error: ' + error.message);
    }
}

// Add a test button to the page
document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Login';
    testButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; background: red; color: white; border: none; cursor: pointer;';
    testButton.onclick = testLogin;
    document.body.appendChild(testButton);
}); 