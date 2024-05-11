const axios = require('axios');

const uploadImage = async (imageUrl) => {
    try {
        // Make a POST request to upload the image to the specified endpoint
        const response = await axios.post('https://twinbrothers.blr1.digitaloceanspaces.com', {
            imageUrl: imageUrl // Pass the image URL or data in the request body
        });

        console.log('Image uploaded:', response.data);

        return response.data; // Return the response data
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('An error occurred while uploading the image');
    }
};


module.exports = { uploadImage };