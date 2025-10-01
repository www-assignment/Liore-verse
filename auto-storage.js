// auto-storage.js - AUTOMATIC VERSION
const GIST_ID = '6a45e1c644434f1ad83fef312ad7f682'; // You'll get this after creating a gist

class AutoStorage {
    constructor() {
        this.data = null;
        this.gistId = GIST_ID;
    }

    async loadData() {
        try {
            // Try to load from Gist first
            if (this.gistId && this.gistId !== '6a45e1c644434f1ad83fef312ad7f682') {
                const response = await fetch(`https://api.github.com/gists/${this.gistId}`);
                if (response.ok) {
                    const gist = await response.json();
                    const content = gist.files['story-owners.json'].content;
                    this.data = JSON.parse(content);
                    console.log('Data loaded automatically from Gist:', this.data);
                    return this.data;
                }
            }
        } catch (error) {
            console.log('Gist not available, using localStorage');
        }
        
        // Fallback to localStorage
        const localData = JSON.parse(localStorage.getItem('lioreStoryOwners')) || [];
        this.data = localData;
        return localData;
    }

    async saveData(data) {
        // Always save to localStorage
        localStorage.setItem('lioreStoryOwners', JSON.stringify(data));
        this.data = data;
        
        // Try to save to Gist automatically
        if (this.gistId && this.gistId !== 'YOUR_GIST_ID_HERE') {
            try {
                await this.updateGist(data);
                console.log('Data saved automatically to Gist!');
                return true;
            } catch (error) {
                console.log('Failed to save to Gist automatically');
            }
        } else {
            // Show setup instructions if Gist not configured
            this.showGistSetup(data);
        }
        
        return true;
    }

    async updateGist(data) {
        const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: {
                    'story-owners.json': {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update Gist');
        }
    }

    showGistSetup(data) {
        console.log('=== AUTOMATIC STORAGE SETUP ===');
        console.log('For automatic updates across all devices:');
        console.log('1. Go to https://gist.github.com/');
        console.log('2. Click "Create new gist"');
        console.log('3. Name: "story-owners.json"');
        console.log('4. Paste this content:');
        console.log(JSON.stringify(data, null, 2));
        console.log('5. Click "Create public gist"');
        console.log('6. Copy the Gist ID from the URL (the long hash)');
        console.log('7. Replace "YOUR_GIST_ID_HERE" in auto-storage.js with your Gist ID');
        console.log('8. Save and reload - owners will now sync automatically!');
        console.log('=== END SETUP ===');
    }
}

window.cloudStorage = new AutoStorage();