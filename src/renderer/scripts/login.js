const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const loginButton = document.getElementById('loginButton');
const closeButton = document.getElementById('closeButton');

// Close button handler
closeButton.addEventListener('click', () => {
  window.close();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const accessKeyId = document.getElementById('accessKeyId').value.trim();
  const secretAccessKey = document.getElementById('secretAccessKey').value.trim();
  
  if (!accessKeyId || !secretAccessKey) {
    showError('Please enter both Access Key ID and Secret Access Key.');
    return;
  }
  
  // Show loading state
  loginButton.disabled = true;
  loginButton.classList.add('loading');
  hideError();
  
  try {
    const result = await window.electronAPI.login({
      accessKeyId,
      secretAccessKey
    });
    
    if (result.success) {
      // Success! Main process will navigate to main view
      console.log('Login successful');
    } else {
      showError(result.error || 'Invalid credentials. Please check and try again.');
      loginButton.disabled = false;
      loginButton.classList.remove('loading');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Authentication failed. Please verify your keys.');
    loginButton.disabled = false;
    loginButton.classList.remove('loading');
  }
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

function hideError() {
  errorMessage.classList.remove('show');
}
