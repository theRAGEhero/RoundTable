// Common navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
    }
    
    // Set active navigation link based on current page
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.endsWith(href)) {
            item.classList.add('active');
        }
    });
    
    // Login modal functionality
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.querySelector('.login-modal');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('show');
        });
        
        // Close modal when clicking outside
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('show');
            }
        });
        
        // Close button in modal
        const closeBtn = loginModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                loginModal.classList.remove('show');
            });
        }
        
        // Handle login option selection
        const emailOption = loginModal.querySelector('.login-option.email');
        const loginForm = loginModal.querySelector('.login-form');
        
        if (emailOption && loginForm) {
            emailOption.addEventListener('click', function() {
                loginForm.classList.add('show');
                // Focus on email input
                const emailInput = loginForm.querySelector('input[type="email"]');
                if (emailInput) {
                    emailInput.focus();
                }
            });
        }
        
        // Google login
        const googleOption = loginModal.querySelector('.login-option.google');
        if (googleOption) {
            googleOption.addEventListener('click', function() {
                // Simulate Google OAuth flow
                console.log('Google login clicked');
                alert('Google login would be implemented here with OAuth');
                // In a real implementation, you would redirect to Google OAuth
            });
        }
        
        // Metamask login
        const metamaskOption = loginModal.querySelector('.login-option.metamask');
        if (metamaskOption) {
            metamaskOption.addEventListener('click', function() {
                console.log('Metamask login clicked');
                
                // Check if Metamask is installed
                if (typeof window.ethereum !== 'undefined') {
                    connectMetamask();
                } else {
                    alert('Metamask is not installed. Please install Metamask to use this login option.');
                    window.open('https://metamask.io/download/', '_blank');
                }
            });
        }
    }
    
    // Form submission
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            console.log('Login submitted with:', email);
            // Simulate login
            alert(`Login submitted with email: ${email}`);
            // In a real implementation, you would send a request to your server
            
            // Close modal
            loginModal.classList.remove('show');
        });
    }
});

// Function to connect to Metamask
async function connectMetamask() {
    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        
        console.log('Connected to Metamask with account:', account);
        alert(`Connected with Metamask account: ${account}`);
        
        // In a real implementation, you would verify this account on your server
        
        // Close modal
        const loginModal = document.querySelector('.login-modal');
        if (loginModal) {
            loginModal.classList.remove('show');
        }
    } catch (error) {
        console.error('Error connecting to Metamask:', error);
        alert('Error connecting to Metamask. Please try again.');
    }
}
