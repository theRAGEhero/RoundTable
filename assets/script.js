// Update navigation based on route info
function updateNavigation(routeInfo) {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = `
        <li><a href="#" class="active">Round Tables</a></li>
        <li><a href="#">${routeInfo.routeTitle}</a></li>
        <li><a href="#">Resources</a></li>
        <li><a href="#">About</a></li>
    `;
}

// Update QR code for blockchain verification
function updateQRCode(url) {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}" alt="QR Code for verification">`;
}

// Update chat welcome message
function updateChatWelcomeMessage(data) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Welcome to the ${data.routeInfo.routeTitle} AI assistant. How can I help you explore Round Table ${data.roundTableInfo.roundTableNumber}: ${data.roundTableInfo.roundTableTitle}?`;
}

// Render timeline nodes dynamically
function renderTimelineNodes(data) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    // Get the current round table number
    const currentRound = data.roundTableInfo.roundTableNumber;
    
    // Calculate which round tables to show (3 before and 3 after if possible)
    let startRound = Math.max(1, currentRound - 3);
    let endRound = Math.min(data.routeInfo.totalRoundTables, currentRound + 3);
    
    // Adjust to always show 7 nodes if possible
    if (endRound - startRound < 6) {
        if (startRound === 1) {
            endRound = Math.min(startRound + 6, data.routeInfo.totalRoundTables);
        } else if (endRound === data.routeInfo.totalRoundTables) {
            startRound = Math.max(1, endRound - 6);
        }
    }
    
    // Create nodes for each round table in the range
    for (let i = startRound; i <= endRound; i++) {
        let nodeTitle = '';
        
        // Use actual titles for current, previous, and next round tables if available
        if (i === currentRound) {
            nodeTitle = data.roundTableInfo.roundTableTitle.split(' ')[0];
        } else if (data.roundTableInfo.previousRoundTable && i === data.roundTableInfo.previousRoundTable.number) {
            nodeTitle = data.roundTableInfo.previousRoundTable.title.split(' ')[0];
        } else if (data.roundTableInfo.nextRoundTable && i === data.roundTableInfo.nextRoundTable.number) {
            nodeTitle = data.roundTableInfo.nextRoundTable.title.split(' ')[0];
        } else {
            // Use generic title based on position
            const position = i - startRound;
            const titles = ['Principles', 'Frameworks', 'Tools', 'Engagement', 'Governance', 'Implementation', 'Future'];
            nodeTitle = titles[position % titles.length];
        }
        
        const node = document.createElement('div');
        node.className = 'timeline-node';
        node.setAttribute('data-round', i);
        node.innerHTML = `
            <div class="node-content">
                <span class="node-number">${i}</span>
                <span class="node-title">${nodeTitle}</span>
            </div>
        `;
        
        timeline.appendChild(node);
    }
    
    // Add click event listeners
    const timelineNodes = document.querySelectorAll('.timeline-node');
    timelineNodes.forEach(node => {
        node.addEventListener('click', function() {
            const roundNumber = parseInt(this.getAttribute('data-round'));
            const currentRound = data.roundTableInfo.roundTableNumber;
            
            if (roundNumber !== currentRound) {
                // Navigate to the specific round table
                navigateToRoundTable(`roundtable${roundNumber}.json`);
            }
        });
    });
// Add loading indicator styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        body.loading:before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        body.loading:after {
            content: 'Loading...';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--primary-color);
            font-weight: bold;
            z-index: 10000;
        }
        
        .highlight-topic {
            font-weight: 500;
            color: var(--primary-color);
        }
        
        .timeline-node.completed {
            border-color: var(--primary-color);
            background-color: var(--primary-color);
        }
        
        .timeline-node.completed .node-number,
        .timeline-node.completed .node-title {
            color: white;
        }
    </style>
`);

// Function to update video embed
function updateVideoEmbed(videoUrl) {
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

// Setup navigation between round tables
function setupNavigation(prevRoundTable, nextRoundTable) {
    const prevButton = document.getElementById('prevRoundTable');
    const nextButton = document.getElementById('nextRoundTable');
    
    if (prevRoundTable) {
        prevButton.textContent = `← Round Table ${prevRoundTable.number}: ${prevRoundTable.title}`;
        prevButton.addEventListener('click', function() {
            navigateToRoundTable(prevRoundTable.dataFile);
        });
        prevButton.removeAttribute('disabled');
    } else {
        prevButton.textContent = '← Previous Round Table';
        prevButton.setAttribute('disabled', 'true');
    }
    
    if (nextRoundTable) {
        nextButton.textContent = `Round Table ${nextRoundTable.number}: ${nextRoundTable.title} →`;
        nextButton.addEventListener('click', function() {
            navigateToRoundTable(nextRoundTable.dataFile);
        });
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.textContent = 'Next Round Table →';
        nextButton.setAttribute('disabled', 'true');
    }
}

// Function to navigate to another round table
function navigateToRoundTable(dataFile) {
    console.log(`Navigating to: ${dataFile}`);
    
    // Show loading state
    document.getElementById('loadingOverlay').classList.add('show');
    
    // Load the new data file
    loadDataFromFile(`data/${dataFile}`);
}

// Function to load data from a specific file
function loadDataFromFile(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', filePath, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    initializeApp(data);
                    // Hide loading overlay
                    document.getElementById('loadingOverlay').classList.remove('show');
                    // Update URL without reloading
                    window.history.pushState({filePath: filePath}, '', `?roundTable=${data.roundTableInfo.roundTableNumber}`);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    showErrorMessage(`There was a problem parsing the data from ${filePath}.`);
                }
            } else {
                console.error('Error loading data. Status:', xhr.status);
                showErrorMessage(`Unable to load data from ${filePath}. Please ensure you're running this app through a web server.`);
                
                // For demo purposes, fallback to reloading the page
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Request error');
        showErrorMessage(`Network error loading ${filePath}. To run locally, please use a web server.`);
    };
    
    xhr.send(null);
}

// Update timeline based on current round table
function updateTimeline(currentRoundTable) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        const nodeRound = parseInt(node.getAttribute('data-round'));
        node.classList.remove('active');
        node.classList.remove('completed');
        
        if (nodeRound === currentRoundTable) {
            node.classList.add('active');
        } else if (nodeRound < currentRoundTable) {
            node.classList.add('completed');
        }
    });
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Function to load data from JSON file
function loadData() {
    // Check URL for roundTable parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roundTable = urlParams.get('roundTable');
    
    // Default to roundtable6.json or use the specified roundTable
    let dataFile = 'data/roundtable6.json';
    if (roundTable) {
        dataFile = `data/roundtable${roundTable}.json`;
    }
    
    loadDataFromFile(dataFile);
}

// Show error message in the UI
function showErrorMessage(message) {
    document.body.innerHTML = `
        <div style="padding: 2rem; text-align: center; max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
            <h2 style="color: #3a86ff; margin-bottom: 1rem;">Error Loading Data</h2>
            <p style="margin-bottom: 1.5rem; color: #212529;">${message}</p>
            <div style="padding: 1rem; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #343a40;">Quick Fix:</h3>
                <p style="color: #495057; margin-bottom: 0.8rem;">To view this application properly:</p>
                <ul style="text-align: left; color: #495057; margin-bottom: 1rem;">
                    <li style="margin-bottom: 0.5rem;">Use a local web server like Python's SimpleHTTPServer</li>
                    <li style="margin-bottom: 0.5rem;">Use VS Code with the Live Server extension</li>
                    <li style="margin-bottom: 0.5rem;">Use any other local development server</li>
                </ul>
            </div>
            <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background-color: #3a86ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
        </div>
    `;
}

function initializeApp(data) {
    // Reset loading state
    document.getElementById('loadingOverlay').classList.remove('show');
    
    // Update page metadata
    document.title = `${data.routeInfo.routeTitle} - Round Table ${data.roundTableInfo.roundTableNumber}`;
    
    // Update header/main titles
    document.getElementById('mainTitle').textContent = data.routeInfo.routeTitle;
    document.getElementById('logoText').textContent = data.routeInfo.routeTitle.split(' ').map(word => word[0]).join('');
    document.getElementById('footerTitle').textContent = data.routeInfo.routeTitle;
    
    // Update navigation
    updateNavigation(data.routeInfo);
    
    // Fill in route information
    document.getElementById('routeTitle').textContent = data.routeInfo.routeTitle;
    document.getElementById('roundTableNumber').textContent = data.roundTableInfo.roundTableNumber;
    document.getElementById('roundTableTitle').textContent = data.roundTableInfo.roundTableTitle;
    
    // Update copyright date
    const currentYear = new Date().getFullYear();
    document.getElementById('copyright').textContent = `© ${currentYear} ${data.routeInfo.routeTitle}. All rights reserved.`;
    
    // Fill in summary information
    document.getElementById('previousSummary').textContent = data.discussionSummary.previousSummary;
    document.getElementById('keySummary').textContent = data.discussionSummary.keySummary;

    // Populate blockchain info
    document.getElementById('blockchainHash').textContent = data.blockchainRecord.hash;
    document.getElementById('blockchainTimestamp').textContent = new Date(data.blockchainRecord.timestamp).toLocaleString();
    document.getElementById('verificationLink').href = data.blockchainRecord.verificationUrl;
    updateQRCode(data.blockchainRecord.verificationUrl);

    // Update modal titles
    document.getElementById('transcriptModalTitle').textContent = `Full Transcript - Round Table ${data.roundTableInfo.roundTableNumber}`;
    
    // Render participants in the video section
    renderParticipants(data.roundTableInfo.guests);
    
    // Render participants in sidebar
    renderParticipantsList(data.roundTableInfo.guests);
    
    // Render transcript highlights from the summary
    renderDiscussionHighlights(data.discussionSummary.highlights);
    
    // Render related resources
    renderRelatedResources(data.relatedResources);
    
    // Render timeline nodes
    renderTimelineNodes(data);

    // Set up navigation buttons
    setupNavigation(data.roundTableInfo.previousRoundTable, data.roundTableInfo.nextRoundTable);
    
    // Update video URL
    updateVideoEmbed(data.mediaInfo.videoUrl);
    
    // Update welcome message
    updateChatWelcomeMessage(data);
    
    // Set up other event listeners
    setupEventListeners(data);
    
    // Update the active node in the timeline
    updateTimeline(data.roundTableInfo.roundTableNumber);
}

function renderParticipants(guests) {
    const participantsContainer = document.getElementById('participants');
    participantsContainer.innerHTML = '';
    
    guests.forEach(guest => {
        const participantElement = document.createElement('div');
        participantElement.className = 'participant-card';
        participantElement.innerHTML = `
            <img src="${guest.avatar}" alt="${guest.name}" class="participant-avatar">
            <span class="participant-name">${guest.name}</span>
            <span class="participant-role">${guest.role}</span>
        `;
        
        participantsContainer.appendChild(participantElement);
    });
}

function renderParticipantsList(guests) {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = '';
    
    guests.forEach(guest => {
        const participantElement = document.createElement('div');
        participantElement.className = 'participant-item';
        participantElement.innerHTML = `
            <img src="${guest.avatar}" alt="${guest.name}">
            <div class="participant-info">
                <h5>${guest.name}</h5>
                <p>${guest.role}</p>
                <p class="participant-wallet">${guest.walletId}</p>
            </div>
        `;
        
        participantsList.appendChild(participantElement);
    });
}

function renderDiscussionHighlights(highlights) {
    const highlightsContainer = document.getElementById('transcriptHighlights');
    highlightsContainer.innerHTML = '';
    
    highlights.forEach(highlight => {
        const highlightElement = document.createElement('div');
        highlightElement.className = 'highlight-card';
        highlightElement.innerHTML = `
            <div class="highlight-header">
                <span class="highlight-topic">${highlight.topic}</span>
            </div>
            <p>${highlight.content}</p>
        `;
        
        highlightsContainer.appendChild(highlightElement);
    });
}

function renderRelatedResources(resources) {
    const resourcesList = document.getElementById('resourcesList');
    resourcesList.innerHTML = '';
    
    resources.forEach(resource => {
        let icon = 'fas fa-link';
        if (resource.type === 'website') icon = 'fas fa-globe';
        if (resource.type === 'organization') icon = 'fas fa-building';
        if (resource.type === 'research') icon = 'fas fa-file-alt';
        if (resource.type === 'platform') icon = 'fas fa-desktop';
        if (resource.type === 'event') icon = 'fas fa-calendar-alt';
        if (resource.type === 'book') icon = 'fas fa-book';
        
        const resourceElement = document.createElement('li');
        resourceElement.innerHTML = `
            <a href="${resource.url}" target="_blank">
                <i class="${icon}"></i>
                ${resource.title}
                <span class="resource-type">${resource.type}</span>
            </a>
        `;
        
        resourcesList.appendChild(resourceElement);
    });
}

function setupEventListeners(data) {
    // Transcript modal
    const transcriptBtn = document.getElementById('transcriptBtn');
    const transcriptModal = document.getElementById('transcriptModal');
    const transcriptContainer = transcriptModal.querySelector('.transcript-container');
    
    transcriptBtn.addEventListener('click', function() {
        transcriptModal.classList.add('show');
        
        // Load the transcript from a file
        loadTranscript(transcriptContainer, data.mediaInfo.transcriptFile);
    });
    
    // Function to load transcript from text file
    function loadTranscript(container, transcriptPath) {
        container.innerHTML = '<p class="loading-text">Loading transcript...</p>';
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', transcriptPath, true);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Format the transcript text for better display
                    const formattedTranscript = formatTranscript(xhr.responseText);
                    container.innerHTML = formattedTranscript;
                } else {
                    console.error('Error loading transcript. Status:', xhr.status);
                    container.innerHTML = '<p class="error-text">Error loading transcript. Please try again later.</p>';
                    
                    // Fallback content based on the current round table
                    setTimeout(() => {
                        if (data.roundTableInfo.id.includes('rt6')) {
                            container.innerHTML = `
                                <h4>Round Table 6: Civic Engagement in Digital Societies</h4>
                                <p><strong>Alessandro Oppo:</strong> Welcome to Round Table 6 of Democracy Innovators. Today, we're discussing civic engagement in digital societies. I'm delighted to welcome Josef Lentsch, an expert in democratic innovation and institutional design.</p>
                                <p><strong>Josef Lentsch:</strong> Thank you for having me, Alessandro. I'm looking forward to our conversation about these important topics.</p>
                                <p><strong>Alessandro Oppo:</strong> Let's start by discussing what you see as the key challenges for democracy in the digital age.</p>
                                <p><em>...loading transcript failed, showing preview only...</em></p>
                            `;
                        } else if (data.roundTableInfo.id.includes('rt5')) {
                            container.innerHTML = `
                                <h4>Round Table 5: Digital Democracy Tools</h4>
                                <p><strong>Alessandro Oppo:</strong> Welcome to Round Table 5 of Democracy Innovators. Today, we're discussing digital democracy tools with Lukas Salecker, co-founder and CEO of deliberAIde.</p>
                                <p><strong>Lukas Salecker:</strong> Hey Alessandro, glad to be here.</p>
                                <p><strong>Alessandro Oppo:</strong> I see that you have co-founded deliberAIde. How would you describe it - is it a platform, software, or idea?</p>
                                <p><em>...loading transcript failed, showing preview only...</em></p>
                            `;
                        } else {
                            container.innerHTML = `
                                <h4>Round Table ${data.roundTableInfo.roundTableNumber}: ${data.roundTableInfo.roundTableTitle}</h4>
                                <p><em>Unable to load transcript preview for this round table.</em></p>
                            `;
                        }
                    }, 1000);
                }
            }
        };
        
        xhr.send();
    }
    
    // Format transcript for better display
    function formatTranscript(text) {
        let formattedText = text;
        
        // Add title
        if (text.startsWith('Interview with Josef Lentsch')) {
            formattedText = '<h3 class="transcript-title">Interview with Josef Lentsch by Alessandro Oppo</h3>' + text.substring(text.indexOf('\n'));
        } else if (text.startsWith('Interview with Lukas Salecker')) {
            formattedText = '<h3 class="transcript-title">Interview with Lukas Salecker by Alessandro Oppo</h3>' + text.substring(text.indexOf('\n'));
        }
        
        // Replace timestamps with highlighted format - adapt to the actual format in the transcript
        formattedText = formattedText.replace(/\[(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})\]/g, '<span class="transcript-timestamp">[$1]</span>');
        
        // Format speaker names (adjust for names like "Josef Lentsch:")
        formattedText = formattedText.replace(/^([A-Za-z]+ [A-Za-z]+):/gm, '<strong>$1:</strong>');
        
        // Add special formatting for sections
        formattedText = formattedText.replace(/^(PARTICIPANTS:|--- TRANSCRIPT BEGINS ---|--- TRANSCRIPT ENDS ---)/gm, '<h4 class="transcript-section">$1</h4>');
        
        // Add note about automatic transcription
        formattedText = formattedText.replace(/(Note: This is an automatic transcription and may contain errors\.)/g, '<em class="transcript-note">$1</em>');
        
        // Convert line breaks to paragraphs, but keep logical grouping
        const paragraphs = formattedText.split('\n\n');
        return paragraphs.map(p => {
            // Don't wrap headers in paragraph tags
            if (p.includes('<h3') || p.includes('<h4')) return p;
            
            // Handle multi-line paragraphs
            const lines = p.split('\n').filter(line => line.trim() !== '');
            return `<p>${lines.join('<br>')}</p>`;
        }).join('');
    }
    
    // Blockchain modal
    const blockchainBtn = document.getElementById('blockchainBtn');
    const blockchainModal = document.getElementById('blockchainModal');
    
    blockchainBtn.addEventListener('click', function() {
        blockchainModal.classList.add('show');
    });
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            transcriptModal.classList.remove('show');
            blockchainModal.classList.remove('show');
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === transcriptModal) {
            transcriptModal.classList.remove('show');
        }
        if (event.target === blockchainModal) {
            blockchainModal.classList.remove('show');
        }
    });
    
    // Timeline navigation
    const timelineNodes = document.querySelectorAll('.timeline-node');
    timelineNodes.forEach(node => {
        node.addEventListener('click', function() {
            const roundNumber = parseInt(this.getAttribute('data-round'));
            const currentRound = data.roundTableInfo.roundTableNumber;
            
            if (roundNumber !== currentRound) {
                // Navigate to the specific round table
                navigateToRoundTable(`roundtable${roundNumber}.json`);
            }
        });
    });
    
    // Previous/Next navigation
    document.getElementById('prevRoundTable').addEventListener('click', function() {
        if (data.roundTableInfo.previousRoundTable) {
            navigateToRoundTable(data.roundTableInfo.previousRoundTable.dataFile);
        }
    });
    
    document.getElementById('nextRoundTable').addEventListener('click', function() {
        if (data.roundTableInfo.nextRoundTable) {
            navigateToRoundTable(data.roundTableInfo.nextRoundTable.dataFile);
        }
    });
    
    // Chat functionality
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    function sendMessage() {
        if (messageInput.value.trim() === '') return;
        
        // Add user message
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user';
        userMessageElement.innerHTML = `
            <div class="message-content">
                <p>${messageInput.value}</p>
            </div>
        `;
        chatMessages.appendChild(userMessageElement);
        
        // Simulate AI response (in a real app, this would be an API call)
        setTimeout(() => {
            const aiResponse = getAIResponse(messageInput.value, data);
            const aiMessageElement = document.createElement('div');
            aiMessageElement.className = 'message system';
            aiMessageElement.innerHTML = `
                <div class="message-content">
                    <p>${aiResponse}</p>
                </div>
            `;
            chatMessages.appendChild(aiMessageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        // Clear input and scroll to bottom
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
}

// Simulate AI responses based on user input
function getAIResponse(userMessage, data) {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Get guest information
    const host = data.roundTableInfo.guests.find(g => g.role.includes('Host'));
    const guest = data.roundTableInfo.guests.find(g => !g.role.includes('Host'));
    
    if (lowercaseMessage.includes('blockchain') || lowercaseMessage.includes('verification')) {
        return "The Round Table discussions are verified using blockchain technology to ensure transparency and immutability. Each session's metadata and transcript hash are stored on Ethereum, allowing anyone to verify the authenticity of the content.";
    } else if (host && (lowercaseMessage.includes(host.name.toLowerCase()) || lowercaseMessage.includes('host'))) {
        return `${host.name} is the host of Democracy Innovators. In this Round Table, he guides the conversation exploring key issues in democratic innovation and digital civic engagement.`;
    } else if (guest && (lowercaseMessage.includes(guest.name.toLowerCase()))) {
        return `${guest.name} is a ${guest.role}. In this Round Table, he shares insights about ${data.discussionSummary.highlights[0].topic.toLowerCase()} and emphasizes that ${data.discussionSummary.highlights[1].content.substring(0, 100)}...`;
    } else if (lowercaseMessage.includes('next') || lowercaseMessage.includes(`round table ${data.roundTableInfo.roundTableNumber + 1}`)) {
        if (data.roundTableInfo.nextRoundTable) {
            return `Round Table ${data.roundTableInfo.nextRoundTable.number} will focus on ${data.roundTableInfo.nextRoundTable.title}, exploring how the ideas discussed in this round table can be further developed and applied.`;
        } else {
            return "The next Round Table is still in preparation. Stay tuned for updates!";
        }
    } else if (lowercaseMessage.includes('previous') || lowercaseMessage.includes(`round table ${data.roundTableInfo.roundTableNumber - 1}`)) {
        if (data.roundTableInfo.previousRoundTable) {
            return `Round Table ${data.roundTableInfo.previousRoundTable.number} focused on ${data.roundTableInfo.previousRoundTable.title}. ${data.discussionSummary.previousSummary}`;
        } else {
            return "This is the first Round Table in the series.";
        }
    } else if (lowercaseMessage.includes('summary') || lowercaseMessage.includes('key points')) {
        return `The key insight from this Round Table is: ${data.discussionSummary.keySummary}`;
    } else {
        return `I'm the Democracy Innovators AI assistant. I can help you explore themes from Round Table ${data.roundTableInfo.roundTableNumber}: ${data.roundTableInfo.roundTableTitle}. Feel free to ask about specific speakers, concepts, or related resources.`;
    }
}
