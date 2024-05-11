
const deleteImageFromDigitalOceanSpaces = require("../services/delteImgaeFromDigitalOceanSpace.js")
const uploadtoS3 = ("../services/uplodToDigitalOceanSpaces.js");

module.export= storeUploadedImages = async (req, res)=>{
    try {
    const eventImages = req.files;

    if (!eventImages || eventImages.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const promises = eventImages.map(async (eventimage) => {
      const file_name = eventimage.originalname;
      const file_type = eventimage.mimetype;
      const file_size = eventimage.size;

      // Example: Upload to DigitalOcean Spaces (or S3)
      const file_path = `events/${file_name}`;
      const file_url = await uploadtoS3(eventimage.buffer, file_path, file_type);

      return {
        file_url: file_url,
        file_name: file_name,
        file_type: file_type,
        file_size: file_size,
      };
    });

    const uploadedFiles = await Promise.all(promises);

    res.json({ success: true, uploadedFiles: uploadedFiles });
  } catch (error) {
    console.error('Error processing attachments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.export= deleteUploadedImages = async (req, res) => {
  try {
    const { fileName } = req.body; 
    await deleteImageFromDigitalOceanSpaces(fileName);

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, error: 'Failed to delete image' });
  }
};