// Upload base64 image to backend proxy and return the Firebase URL
export const uploadImage = async (base64Image: string): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};