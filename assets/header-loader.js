// Function to load the common header
async function loadHeader() {
    try {
        const response = await fetch('includes/header.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        // Insert the header at the beginning of the body
        const headerContainer = document.createElement('div');
        headerContainer.innerHTML = html;
        
        // Insert the header at the beginning of the body
        const body = document.body;
        body.insertBefore(headerContainer, body.firstChild);
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Load the header when the DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader);
