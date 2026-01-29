const API_URL = 'http://localhost:5000/api';

export const storyService = {
    async fetchStory() {
        try {
            const response = await fetch(`${API_URL}/story`);
            if (!response.ok) throw new Error('Failed to fetch story');
            return await response.json();
        } catch (error) {
            console.error('Error in fetchStory:', error);
            throw error;
        }
    },

    async updateStory(storyData) {
        try {
            const response = await fetch(`${API_URL}/story`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storyData),
            });
            if (!response.ok) throw new Error('Failed to update story');
            return await response.json();
        } catch (error) {
            console.error('Error in updateStory:', error);
            throw error;
        }
    }
};
