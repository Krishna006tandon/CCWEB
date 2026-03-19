// API Configuration Test
// This will help debug the API URL issues

const testApiConfig = () => {
  console.log('=== API Configuration Test ===');
  console.log('Current URL:', window.location.href);
  console.log('Hostname:', window.location.hostname);
  console.log('Protocol:', window.location.protocol);
  
  // Test the API base URL logic
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const apiBaseUrl = isLocal ? 'http://localhost:5000/api' : '/api';
  
  console.log('Is Local:', isLocal);
  console.log('API Base URL:', apiBaseUrl);
  
  // Test making a request to the API
  fetch(apiBaseUrl + '/test')
    .then(response => {
      console.log('API Test Response Status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('API Test Response Data:', data);
    })
    .catch(error => {
      console.error('API Test Error:', error);
    });
};

// Run the test
testApiConfig();
