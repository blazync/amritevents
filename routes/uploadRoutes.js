const { Router } = require("express");
const authenticate = require("../middleware/auth.js");
const multer = require("multer");
const { storeUploadedImages, deleteUploadedImages } = require("../controllers/uploadController.js");

const storage = multer.memoryStorage();
const upload = multer();

const router = Router();

/** POST a new enquiry */
router.post('/upload/event-image', authenticate, upload.array('event_images[]'), storeUploadedImages);

/** DELETE a new enquiry */
router.delete('/event-image', authenticate, deleteUploadedImages);

module.exports = router;
