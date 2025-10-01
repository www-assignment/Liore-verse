// gist-storage.js - WORKS FOR ALL USERS!
const GIST_ID = '6a45e1c644434f1ad83fef312ad7f682';

class GistStorage {
    constructor() {
        this.data = null;
    }

    // FOR ALL USERS: Automatically loads from Gist
    async loadData() {
        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
            if (response.ok) {
                const gist = await response.json();
                const content = gist.files['story-owners.json'].content;
                this.data = JSON.parse(content);
                console.log('✅ Owners loaded for all users:', this.data);
                return this.data;
            }
        } catch (error) {
            console.log('❌ Using empty data');
        }
        return [];
    }

    // FOR YOU ONLY: Shows easy update instructions
    async saveData(data) {
        localStorage.setItem('lioreStoryOwners', JSON.stringify(data));
        this.data = data;
        this.showUpdatePopup(data);
        return true;
    }

    showUpdatePopup(data) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 90%; max-height: 80%; overflow: auto; border: 3px solid #4F0C0C;
        `;
        
        popup.innerHTML = `
            <h3 style="color: #4F0C0C; margin-bottom: 15px;">🔄 Update Owners for All Users</h3>
            <p><strong>1.</strong> <a href="https://gist.github.com/www-assignment/6a45e1c644434f1ad83fef312ad7f682/edit" target="_blank" style="color: #4F0C0C;">Click here to edit your Gist</a></p>
            <p><strong>2.</strong> Copy this JSON and replace ALL content:</p>
            <textarea style="width: 100%; height: 200px; font-family: monospace; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin: 10px 0;" onclick="this.select()">${JSON.stringify(data, null, 2)}</textarea>
            <p><strong>3.</strong> Click "Update gist"</p>
            <p><strong>4.</strong> All users will see changes immediately! 🌍</p>
            <button onclick="this.parentElement.remove()" style="padding: 10px 20px; background: #4F0C0C; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">Close</button>
        `;
        
        document.body.appendChild(popup);
    }
}

window.cloudStorage = new GistStorage();