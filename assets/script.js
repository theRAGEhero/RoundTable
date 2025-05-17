// Simplified script for round table loading
document.addEventListener('DOMContentLoaded', function() {
    // Get round table from URL
    const urlParams = new URLSearchParams(window.location.search);
    const roundTable = urlParams.get('roundTable') || '6';
    
    console.log('Loading round table:', roundTable);
    
    // Load the data
    fetch(`data/roundtable${roundTable}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data loaded successfully');
            displayRoundTable(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            showErrorMessage('Failed to load round table data. Check the console for details.');
        });
});

// Display the round table data
function displayRoundTable(data) {
    // Hide loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }
    
    // Update page title
    document.title = `${data.routeInfo.routeTitle} - Round Table ${data.roundTableInfo.roundTableNumber}`;
    
    // Update route info
    if (document.getElementById('routeTitle')) {
        document.getElementById('routeTitle').textContent = data.routeInfo.routeTitle;
    }
    if (document.getElementById('mainTitle')) {
        document.getElementById('mainTitle').textContent = data.routeInfo.routeTitle;
    }
    if (document.getElementById('roundTableNumber')) {
        document.getElementById('roundTableNumber').textContent = data.roundTableInfo.roundTableNumber;
    }
    if (document.getElementById('roundTableTitle')) {
        document.getElementById('roundTableTitle').textContent = data.roundTableInfo.roundTableTitle;
    }
    
    // Update summary section
    if (document.getElementById('previousSummary')) {
        document.getElementById('previousSummary').textContent = data.discussionSummary.previousSummary;
    }
    if (document.getElementById('keySummary')) {
        document.getElementById('keySummary').textContent = data.discussionSummary.keySummary;
    }
    
    // Update video
    updateVideo(data.mediaInfo.videoUrl);
    
    // Display participants
    displayParticipants(data.roundTableInfo.guests);
    
    // Display highlights
    displayHighlights(data.discussionSummary.highlights);
    
    // Display resources
    displayResources(data.relatedResources);
    
    // Set up navigation
    setupNavigation(data.roundTableInfo.previousRoundTable, data.roundTableInfo.nextRoundTable);
    
    // Set up transcript button
    setupTranscript(data.mediaInfo.transcriptFile);
    
    // Set up blockchain info
    if (document.getElementById('blockchainHash')) {
        document.getElementById('blockchainHash').textContent = data.blockchainRecord.hash;
    }
    if (document.getElementById('blockchainTimestamp')) {
        document.getElementById('blockchainTimestamp').textContent = new Date(data.blockchainRecord.timestamp).toLocaleString();
    }
    if (document.getElementById('verificationLink')) {
        document.getElementById('verificationLink').href = data.blockchainRecord.verificationUrl;
    }
    
    // Set up chat functionality
    setupChat(data);
}

// Update video embed
function updateVideo(videoUrl) {
    const videoContainer = document.querySelector('.responsive-video');
    if (videoContainer) {
        videoContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="315" 
                src="${videoUrl}" 
                title="Democracy Innovators Round Table" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }
}

// Display participants
function displayParticipants(guests) {
    // Main section participants
    const participantsContainer = document.getElementById('participants');
    if (participantsContainer) {
        participantsContainer.innerHTML = '';
        guests.forEach(guest => {
            const element = document.createElement('div');
            element.className = 'participant-card';
            element.innerHTML = `
                <img src="${guest.avatar}" alt="${guest.name}" class="participant-avatar">
                <span class="participant-name">${guest.name}</span>
                <span class="participant-role">${guest.role}</span>
            `;
            participantsContainer.appendChild(element);
        });
    }
    
    // Sidebar participants
    const participantsList = document.getElementById('participantsList');
    if (participantsList) {
        participantsList.innerHTML = '';
        guests.forEach(guest => {
            const element = document.createElement('div');
            element.className = 'participant-item';
            element.innerHTML = `
                <img src="${guest.avatar}" alt="${guest.name}">
                <div class="participant-info">
                    <h5>${guest.name}</h5>
                    <p>${guest.role}</p>
                    <p class="participant-wallet">${guest.walletId}</p>
                </div>
            `;
            participantsList.appendChild(element);
        });
    }
}

// Display highlights
function displayHighlights(highlights) {
    const highlightsContainer = document.getElementById('transcriptHighlights');
    if (highlightsContainer) {
        highlightsContainer.innerHTML = '';
        highlights.forEach(highlight => {
            const element = document.createElement('div');
            element.className = 'highlight-card';
            element.innerHTML = `
                <div class="highlight-header">
                    <span class="highlight-topic">${highlight.topic}</span>
                </div>
                <p>${highlight.content}</p>
            `;
            highlightsContainer.appendChild(element);
        });
    }
}

// Display resources
function displayResources(resources) {
    const resourcesList = document.getElementById('resourcesList');
    if (resourcesList) {
        resourcesList.innerHTML = '';
        resources.forEach(resource => {
            let icon = 'fas fa-link';
            if (resource.type === 'website') icon = 'fas fa-globe';
            if (resource.type === 'organization') icon = 'fas fa-building';
            if (resource.type === 'research') icon = 'fas fa-file-alt';
            if (resource.type === 'platform') icon = 'fas fa-desktop';
            if (resource.type === 'event') icon = 'fas fa-calendar-alt';
            if (resource.type === 'book') icon = 'fas fa-book';
            
            const element = document.createElement('li');
            element.innerHTML = `
                <a href="${resource.url}" target="_blank">
                    <i class="${icon}"></i>
                    ${resource.title}
                    <span class="resource-type">${resource.type}</span>
                </a>
            `;
            resourcesList.appendChild(element);
        });
    }
}

// Set up navigation
function setupNavigation(prevRoundTable, nextRoundTable) {
    const prevButton = document.getElementById('prevRoundTable');
    const nextButton = document.getElementById('nextRoundTable');
    
    if (prevButton) {
        if (prevRoundTable) {
            prevButton.textContent = `← Round Table ${prevRoundTable.number}: ${prevRoundTable.title}`;
            prevButton.onclick = function() {
                window.location.href = `roundtable.html?roundTable=${prevRoundTable.number}`;
            };
            prevButton.disabled = false;
        } else {
            prevButton.textContent = '← Previous Round Table';
            prevButton.disabled = true;
        }
    }
    
    if (nextButton) {
        if (nextRoundTable) {
            nextButton.textContent = `Round Table ${nextRoundTable.number}: ${nextRoundTable.title} →`;
            nextButton.onclick = function() {
                window.location.href = `roundtable.html?roundTable=${nextRoundTable.number}`;
            };
            nextButton.disabled = false;
        } else {
            nextButton.textContent = 'Next Round Table →';
            nextButton.disabled = true;
        }
    }
}

// Set up transcript modal
function setupTranscript(transcriptFile) {
    const transcriptBtn = document.getElementById('transcriptBtn');
    const transcriptModal = document.getElementById('transcriptModal');
    
    if (transcriptBtn && transcriptModal) {
        transcriptBtn.onclick = function() {
            const container = transcriptModal.querySelector('.transcript-container');
            if (container) {
                container.innerHTML = '<p class="loading-text">Loading transcript...</p>';
                
                fetch(transcriptFile)
                    .then(response => response.text())
                    .then(text => {
                        container.innerHTML = formatTranscript(text);
                    })
                    .catch(error => {
                        container.innerHTML = '<p class="error-text">Error loading transcript. Please try again later.</p>';
                    });
            }
            
            transcriptModal.classList.add('show');
        };
        
        // Close button
        const closeBtn = transcriptModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                transcriptModal.classList.remove('show');
            };
        }
    }
    
    // Set up blockchain modal
    const blockchainBtn = document.getElementById('blockchainBtn');
    const blockchainModal = document.getElementById('blockchainModal');
    
    if (blockchainBtn && blockchainModal) {
        blockchainBtn.onclick = function() {
            blockchainModal.classList.add('show');
        };
        
        // Close button
        const closeBtn = blockchainModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                blockchainModal.classList.remove('show');
            };
        }
    }
}

// Set up chat functionality
function setupChat(data) {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    if (messageInput && sendButton && chatMessages) {
        // Welcome message
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome to the ${data.routeInfo.routeTitle} AI assistant. How can I help you explore Round Table ${data.roundTableInfo.roundTableNumber}: ${data.roundTableInfo.roundTableTitle}?`;
        }
        
        // Send message function
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message === '') return;
            
            // Add user message
            const userElement = document.createElement('div');
            userElement.className = 'message user';
            userElement.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
            chatMessages.appendChild(userElement);
            
            // Generate response
            setTimeout(() => {
                const response = generateResponse(message, data);
                
                const aiElement = document.createElement('div');
                aiElement.className = 'message system';
                aiElement.innerHTML = `
                    <div class="message-content">
                        <p>${response}</p>
                    </div>
                `;
                chatMessages.appendChild(aiElement);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Set up event listeners
        sendButton.onclick = sendMessage;
        messageInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        };
    }
}

// Generate chat response
function generateResponse(message, data) {
    message = message.toLowerCase();
    
    // Get round table info
    const host = data.roundTableInfo.guests.find(g => g.role.toLowerCase().includes('host'));
    const guest = data.roundTableInfo.guests.find(g => !g.role.toLowerCase().includes('host'));
    
    // Check for keywords
    if (message.includes('blockchain') || message.includes('verification')) {
        return `The Round Table discussions are verified using blockchain technology to ensure transparency and immutability. Each session's transcript is hashed and stored on Ethereum.`;
    }
    
    if (host && (message.includes(host.name.toLowerCase()) || message.includes('host'))) {
        return `${host.name} is the host of the Democracy Innovators series. In this Round Table, he explores key themes in democratic innovation and digital civic engagement.`;
    }
    
    if (guest && (message.includes(guest.name.toLowerCase()))) {
        return `${guest.name} is a ${guest.role}. In this Round Table, he shares insights about digital democracy and civic technology.`;
    }
    
    if (message.includes('summary') || message.includes('key points')) {
        return data.discussionSummary.keySummary;
    }
    
    if (message.includes('hello') || message.includes('hi ') || message === 'hi') {
        return `Hello! I'm the Democracy Innovators AI assistant. How can I help you explore Round Table ${data.roundTableInfo.roundTableNumber}?`;
    }
    
    // Default response
    return `I can help you explore themes from Round Table ${data.roundTableInfo.roundTableNumber}: ${data.roundTableInfo.roundTableTitle}. You can ask me about the participants, key insights, or specific topics discussed.`;
}

// Format transcript
function formatTranscript(text) {
    let formattedText = text;
    
    // Format transcription title
    if (text.startsWith('Interview with')) {
        const firstNewline = text.indexOf('\n');
        if (firstNewline > 0) {
            const title = text.substring(0, firstNewline);
            formattedText = `<h3 class="transcript-title">${title}</h3>` + text.substring(firstNewline);
        }
    }
    
    // Format timestamps
    formattedText = formattedText.replace(/\[(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})\]/g, '<span class="transcript-timestamp">[$1]</span>');
    
    // Format speakers
    formattedText = formattedText.replace(/^([A-Za-z]+ [A-Za-z]+):/gm, '<strong>$1:</strong>');
    
    // Format sections
    formattedText = formattedText.replace(/^(PARTICIPANTS:|--- TRANSCRIPT BEGINS ---|--- TRANSCRIPT ENDS ---)/gm, '<h4 class="transcript-section">$1</h4>');
    
    // Format notes
    formattedText = formattedText.replace(/(Note: This is an automatic transcription and may contain errors\.)/g, '<em class="transcript-note">$1</em>');
    
    // Split into paragraphs
    const paragraphs = formattedText.split('\n\n');
    return paragraphs.map(p => {
        if (p.includes('<h3') || p.includes('<h4')) return p;
        const lines = p.split('\n').filter(line => line.trim() !== '');
        return `<p>${lines.join('<br>')}</p>`;
    }).join('');
}

// Show error message
function showErrorMessage(message) {
    const container = document.querySelector('.content-main');
    if (container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <h4><i class="fas fa-exclamation-triangle"></i> Error</h4>
                    <p>${message}</p>
                    <p>Please try refreshing the page or go back to the <a href="index.html">home page</a>.</p>
                </div>
            </div>
        `;
    }
    
    // Hide loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }
}
