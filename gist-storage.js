// gist-storage.js - FIXED VERSION
const GIST_ID = '6a45e1c644434f1ad83fef312ad7f682';

class GistStorage {
    constructor() {
        this.data = null;
        this.loading = false;
    }

    // IMPROVED: Better error handling and fallbacks
    async loadData() {
        // Prevent multiple simultaneous loads
        if (this.loading) {
            return new Promise((resolve) => {
                const checkData = () => {
                    if (!this.loading) {
                        resolve(this.data || []);
                    } else {
                        setTimeout(checkData, 100);
                    }
                };
                checkData();
            });
        }

        this.loading = true;

        try {
            console.log('🔄 Loading story owners from Gist...');
            
            // Try to load from Gist with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}?_=${Date.now()}`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                const gist = await response.json();
                const content = gist.files['story-owners.json'].content;
                this.data = JSON.parse(content);
                console.log('✅ Owners loaded successfully:', this.data.length, 'owners found');
                
                // Also save to localStorage as backup
                localStorage.setItem('lioreStoryOwners', JSON.stringify(this.data));
                
                this.loading = false;
                return this.data;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.warn('⚠️ Could not load from Gist, trying localStorage:', error.message);
            
            // Fallback to localStorage
            try {
                const localData = localStorage.getItem('lioreStoryOwners');
                if (localData) {
                    this.data = JSON.parse(localData);
                    console.log('✅ Loaded from localStorage backup:', this.data.length, 'owners');
                } else {
                    this.data = [];
                    console.log('ℹ️ No data found, starting with empty array');
                }
            } catch (localError) {
                console.error('❌ Error loading from localStorage:', localError);
                this.data = [];
            }
        } finally {
            this.loading = false;
        }

        return this.data;
    }

    // FOR YOU ONLY: Shows easy update instructions
    async saveData(data) {
        try {
            localStorage.setItem('lioreStoryOwners', JSON.stringify(data));
            this.data = data;
            console.log('💾 Data saved locally');
            
            // Show update instructions
            this.showUpdatePopup(data);
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    showUpdatePopup(data) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 90%; max-height: 80%; overflow: auto; border: 3px solid #4F0C0C;
            font-family: Arial, sans-serif;
        `;
        
        popup.innerHTML = `
            <h3 style="color: #4F0C0C; margin-bottom: 15px;">🔄 Update Owners for All Users</h3>
            <p><strong>1.</strong> <a href="https://gist.github.com/www-assignment/6a45e1c644434f1ad83fef312ad7f682/edit" target="_blank" style="color: #4F0C0C;">Click here to edit your Gist</a></p>
            <p><strong>2.</strong> Copy this JSON and replace ALL content:</p>
            <textarea style="width: 100%; height: 200px; font-family: monospace; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin: 10px 0; background: #f5f5f5;" onclick="this.select()">${JSON.stringify(data, null, 2)}</textarea>
            <p><strong>3.</strong> Click "Update gist"</p>
            <p><strong>4.</strong> All users will see changes immediately! 🌍</p>
            <button onclick="this.parentElement.remove()" style="padding: 10px 20px; background: #4F0C0C; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">Close</button>
        `;
        
        document.body.appendChild(popup);
    }

    // Force refresh data
    async refreshData() {
        this.data = null;
        return await this.loadData();
    }
}

window.cloudStorage = new GistStorage();