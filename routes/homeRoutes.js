// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Route for the home page
router.get('/', homeController.renderHomePage);
router.get('/services', homeController.renderServicesPage);

module.exports = router;
