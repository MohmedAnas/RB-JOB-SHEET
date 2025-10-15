import fetch from 'node-fetch';

const testLogin = async () => {
  console.log('Testing backend login endpoint...');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'unknowngeek739@gmail.com', // Replace with your actual email from Sheet2
        password: 'Blow@739' // Replace with your actual password from Sheet2
      })
    });

    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
    
    if (data.success) {
      console.log('✅ Login test PASSED');
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Login test FAILED');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testLogin();
