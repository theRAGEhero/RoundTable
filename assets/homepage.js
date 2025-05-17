// Function to load JSON data
async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not load JSON data from ${path}:`, error);
        return null;
    }
}

// Function to find all available round tables
async function findAllRoundTables() {
    const roundTables = [];
    
    // Try to load data for possible round tables (0-10)
    for (let i = 0; i <= 10; i++) {
        const data = await loadJSON(`data/roundtable${i}.json`);
        if (data) {
            console.log(`Found round table ${i}`);
            
            // Extract guest name (if not host)
            let subtitle = ""; 
            if (data.roundTableInfo.guests && data.roundTableInfo.guests.length > 0) {
                const nonHostGuest = data.roundTableInfo.guests.find(g => !g.role.toLowerCase().includes('host'));
                subtitle = nonHostGuest ? nonHostGuest.name : data.roundTableInfo.guests[0].name;
            }
            
            roundTables.push({
                number: data.roundTableInfo.roundTableNumber,
                title: data.roundTableInfo.roundTableTitle,
                subtitle: subtitle,
                dataFile: `roundtable${i}.json`,
                routeInfo: data.routeInfo
            });
        }
    }
    
    // Sort round tables by number
    return roundTables.sort((a, b) => a.number - b.number);
}

// Load and display all available round tables
document.addEventListener('DOMContentLoaded', async function() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const container = document.getElementById('container');
    
    try {
        // Find all available round tables
        const roundTables = await findAllRoundTables();
        
        if (roundTables.length === 0) {
            container.innerHTML = `
                <h1>Democracy Routes</h1>
                <p>No round tables found. Please check that the data files exist in the data folder.</p>
            `;
            return;
        }
        
        // Get route info from the first round table (they should all have the same route info)
        const routeInfo = roundTables[0].routeInfo;
        
        // Create the content
        let html = `
            <h1>${routeInfo.routeTitle}</h1>
            <p>${routeInfo.description || "Select a round table to explore innovative approaches to strengthen democracy in the digital age."}</p>
            <div class="route-list">
        `;
        
        // Add each round table
        roundTables.forEach(rt => {
            html += `
                <a href="roundtable.html?roundTable=${rt.number}" class="route-button">
                    <div class="route-number">${rt.number}</div>
                    <div class="route-info">
                        <div class="route-name">${rt.title}</div>
                        <div class="route-subtitle">${rt.subtitle}</div>
                    </div>
                    <div class="route-arrow">→</div>
                </a>
            `;
        });
        
        html += `</div>`;
        
        // Update the container
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading round tables:', error);
        container.innerHTML = `
            <h1>Democracy Routes</h1>
            <p>An error occurred while loading round tables. Please try again later.</p>
            <p>Error: ${error.message}</p>
        `;
    } finally {
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
});
