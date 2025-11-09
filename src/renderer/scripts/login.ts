// DOM Elements - will be initialized when DOM is ready
let loginForm: HTMLFormElement;
let errorMessage: HTMLDivElement;
let loginButton: HTMLButtonElement;
let closeButtonLogin: HTMLButtonElement;

function showLoginError(message: string): void {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

function hideLoginError(): void {
  errorMessage.classList.remove('show');
}

// Initialize when DOM is ready
console.log('[Login Renderer] Script loaded, waiting for DOM...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Login Renderer] DOM Content Loaded event fired');
  
  loginForm = document.getElementById('loginForm') as HTMLFormElement;
  errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
  loginButton = document.getElementById('loginButton') as HTMLButtonElement;
  closeButtonLogin = document.getElementById('closeButton') as HTMLButtonElement;

  console.log('[Login Renderer] DOM elements initialized:', {
    loginForm: !!loginForm,
    loginButton: !!loginButton,
    closeButtonLogin: !!closeButtonLogin
  });

  // Close button handler
  closeButtonLogin.addEventListener('click', () => {
    console.log('[Login Renderer] Close button clicked');
    window.electronAPI.closeWindow();
  });

  loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const accessKeyId = (document.getElementById('accessKeyId') as HTMLInputElement).value.trim();
    const secretAccessKey = (document.getElementById('secretAccessKey') as HTMLInputElement).value.trim();
    
    if (!accessKeyId || !secretAccessKey) {
      showLoginError('Please enter both Access Key ID and Secret Access Key.');
      return;
    }
    
    // Show loading state
    loginButton.disabled = true;
    loginButton.classList.add('loading');
    hideLoginError();
    
    try {
      const result = await window.electronAPI.login({
        ak: accessKeyId,
        sk: secretAccessKey
      });
      
      if (result && result.success) {
        // Success! Main process will navigate to main view
        console.log('Login successful');
      } else {
        showLoginError(result && result.error ? result.error : 'Invalid credentials. Please check and try again.');
        loginButton.disabled = false;
        loginButton.classList.remove('loading');
      }
    } catch (error) {
      console.error('Login error:', error);
      showLoginError('Authentication failed. Please verify your keys.');
      loginButton.disabled = false;
      loginButton.classList.remove('loading');
    }
  });
});
