// Import necessary modules from AWS SDK
const AWS =require('aws-sdk');

// Create a new AWS.S3 instance configured for DigitalOcean Spaces
const doSpaces = new AWS.S3({
    endpoint: 'https://blr1.digitaloceanspaces.com',
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET
});

// Function to upload a file to DigitalOcean Spaces
const uploadToDigitalOceanSpaces = (buffer, key, contentType) => {
    const params = {
        Bucket: 'amritevents',
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        // Use the doSpaces instance to upload the file
        doSpaces.upload(params, (err, data) => {
            if (err) {
                console.error("Error uploading to DigitalOcean Spaces:", err);
                reject(err);
            } else {
                console.log("Upload successful:", data.Location);
                resolve(data.Location);
            }
        });
    });
};

// Export the uploadToDigitalOceanSpaces function as the default export
module.exports = uploadToDigitalOceanSpaces;
