// IMPROVED function to load and display story owners
async function loadStoryOwners() {
    const storyId = 'ken-saro-wiwa';
    const container = document.getElementById('storyOwnerContainer');
    
    if (!container) {
        console.error('Story owner container not found');
        return;
    }
    
    // Show loading state
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--gray);">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 15px;"></i>
            <p>Loading story owners...</p>
        </div>
    `;
    
    try {
        // Get story owners from cloud storage with retry logic
        let storyOwners = await cloudStorage.loadData();
        
        // If no data loaded, try one more time
        if (!storyOwners || storyOwners.length === 0) {
            console.log('No data loaded, retrying...');
            storyOwners = await cloudStorage.refreshData();
        }
        
        // Find owners assigned to this story
        const assignedOwners = storyOwners.filter(owner => 
            owner.assigned_stories && owner.assigned_stories.includes(storyId)
        );
        
        console.log(`Found ${assignedOwners.length} owners for story ${storyId}`);
        
        if (assignedOwners.length === 0) {
            container.innerHTML = `
                <div class="no-owners-state">
                    <div class="no-owners-icon">
                        <i class="fas fa-user-friends"></i>
                    </div>
                    <h3>This Story Awaits Its Owners</h3>
                    <p>Be among the first to own this powerful story and share your connection to its legacy of courage and vision.</p>
                    <a href="Home.html" class="cta-button">
                        <i class="fas fa-compass"></i>
                        Explore Our Collection
                    </a>
                </div>
            `;
            return;
        }
        
        // Render the owners based on count (your existing rendering code here)
        // ... [keep your existing rendering code] ...
        
    } catch (error) {
        console.error('Error loading story owners:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--danger);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                <p>Unable to load story owners. Please check your connection.</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Retry
                </button>
            </div>
        `;
    }
}

// IMPROVED page load handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing story page...');
    
    // Your existing image handling code
    const storyImage = document.querySelector('.story-image');
    const placeholder = document.querySelector('.image-placeholder');
    
    if (storyImage) {
        storyImage.onerror = function() {
            this.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        };
        
        if (storyImage.complete && storyImage.naturalWidth === 0) {
            storyImage.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        }
    }
    
    // Load story owners immediately
    loadStoryOwners();
    
    // Page entrance effect
    window.addEventListener("load", () => {
        document.body.classList.add("loaded");
        console.log('Page fully loaded');
    });
});

// IMPROVED: Listen for page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page became visible, refreshing owners...');
        // Refresh data when page becomes visible again
        setTimeout(loadStoryOwners, 100);
    }
});

// IMPROVED: Listen for page focus
window.addEventListener('focus', function() {
    console.log('Page focused, refreshing owners...');
    setTimeout(loadStoryOwners, 100);
});