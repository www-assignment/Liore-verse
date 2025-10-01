// cloud-storage.js
const GITHUB_USERNAME = 'www-assignment';
const REPO_NAME = 'Liore-verse';
const DATA_FILE = 'story-owners-data.json';

class CloudStorage {
    constructor() {
        this.data = null;
    }

    getDataUrl() {
        return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${DATA_FILE}`;
    }

    async loadData() {
        try {
            const response = await fetch(this.getDataUrl() + '?t=' + Date.now());
            if (response.ok) {
                this.data = await response.json();
                console.log('Data loaded from GitHub:', this.data);
                return this.data;
            }
        } catch (error) {
            console.log('No cloud data found, using local storage');
        }
        
        // Fallback to local storage
        const localData = JSON.parse(localStorage.getItem('lioreStoryOwners')) || [];
        this.data = localData;
        return localData;
    }

    async saveData(data) {
        // Save to local storage first
        localStorage.setItem('lioreStoryOwners', JSON.stringify(data));
        this.data = data;
        
        // Show instructions for manual update
        console.log('=== CLOUD STORAGE SETUP ===');
        console.log('1. Go to your GitHub repository: https://github.com/www-assignment/Liore-verse');
        console.log('2. Click "Add file" → "Create new file"');
        console.log('3. Name the file: story-owners-data.json');
        console.log('4. Paste this exact content:');
        console.log(JSON.stringify(data, null, 2));
        console.log('5. Click "Commit changes"');
        console.log('6. Wait 1 minute, then refresh your story pages on other devices');
        console.log('=== END INSTRUCTIONS ===');
        
        return true;
    }
}

window.cloudStorage = new CloudStorage();