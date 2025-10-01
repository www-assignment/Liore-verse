// gist-storage.js
const GIST_ID = 'YOUR_GIST_ID_HERE'; // You'll get this after creating a gist

class GistStorage {
    async loadData() {
        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
            const gist = await response.json();
            const content = gist.files['story-owners.json'].content;
            return JSON.parse(content);
        } catch (error) {
            return JSON.parse(localStorage.getItem('lioreStoryOwners')) || [];
        }
    }

    async saveData(data) {
        localStorage.setItem('lioreStoryOwners', JSON.stringify(data));
        // For now, manually update the gist
        console.log('Copy this to your GitHub Gist:');
        console.log(JSON.stringify(data, null, 2));
        return true;
    }
}

window.cloudStorage = new GistStorage();