// Simple test to check if backend is running
const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    
    console.log('✅ Backend is running!');
    console.log('Response:', data);
    
    return true;
  } catch (error) {
    console.log('❌ Backend is not accessible');
    console.log('Error:', error.message);
    return false;
  }
};

testBackend(); 