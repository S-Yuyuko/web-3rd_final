import axios from 'axios';

// Add a new home word
export const addHomeWord = async (
  word: { id: string; title: string; description: string }
): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.post(`api/homewords`, word, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to add home word:', error);
    throw new Error('Failed to add home word.');
  }
};

// Fetch all home words
export const getHomeWords = async (): Promise<any[]> => {
  try {
    // Use NEXT_PUBLIC_API_URL for API calls
    const response = await axios.get(`api/homewords`);
    return response.data.words; // Assuming backend returns { words: [...] }
  } catch (error) {
    throw new Error('Failed to fetch home words.');
  }
};

// Update an existing home word
export const updateHomeWord = async (
  id: string,
  word: { title: string; description: string }
): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.put(`api/homewords/${id}`, word, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    throw new Error('Failed to update home word.');
  }
};
