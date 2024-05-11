const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const dashcontroller = require('../controllers/dashcontroller');
const isAuthenticated = require('../middleware/authentication');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});
const upload = multer({ storage: storage });

// Now use `upload` middleware in your route
router.post('/dashboard/embedgallery', isAuthenticated, upload.single('image'), dashcontroller.embedgallery);

router.get('/', controller.index);
router.get('/portfolio', controller.pose);
router.get('/about', controller.aboutus);
router.get('/services', controller.services);
router.get('/services/corporate', controller.corporate);
router.get('/services/:servicesname', controller.services);
router.get('/lets-talk', controller.contact);
router.post('/contact', controller.contactform);
router.get('/contact', controller.contact);
router.get('/blogs/', controller.blog);
router.get('/blog/:title', controller.blog);
router.get('/account', controller.login);
router.get('/lost-password', controller.lostpassword);
router.post('/login', dashcontroller.loginform);
router.get('/gallery',controller.gallery);

router.get('/lost-password', dashcontroller.lostpassword);
router.post('/login', dashcontroller.loginform);
router.get('/account', dashcontroller.login);
//dashboard
router.get('/dashboard', isAuthenticated, dashcontroller.dashboard);
router.get('/logout',isAuthenticated, dashcontroller.logout);
router.get('/dashboard',isAuthenticated, dashcontroller.dashboard);

router.get('/dashboard/users',isAuthenticated, dashcontroller.users);
router.get('/dashboard/adduser',isAuthenticated, dashcontroller.addUser);
router.post('/dashboard/embedUser',isAuthenticated, dashcontroller.embedUser);
router.get('/dashboard/edituser',isAuthenticated, dashcontroller.editUser);
router.post('/dashboard/edituser',isAuthenticated, dashcontroller.editUser);

router.get('/dashboard/addservices',isAuthenticated, dashcontroller.addservices);
router.get('/dashboard/editservices',isAuthenticated, dashcontroller.editservices);
router.post('/dashboard/embedservice',isAuthenticated, dashcontroller.embedservice);
router.get('/dashboard/deleteservices',isAuthenticated, dashcontroller.deleteservices);
router.get('/dashboard/services', isAuthenticated,dashcontroller.services);

router.get('/dashboard/gallery/', isAuthenticated,dashcontroller.gallery);
router.get('/dashboard/addgalleryimage/', isAuthenticated,dashcontroller.addgalleryimage);
router.get('/dashboard/deletegalleryimage/', isAuthenticated,dashcontroller.deletegalleryimage);

router.get('/dashboard/blog/', isAuthenticated,dashcontroller.blog);
router.get('/dashboard/addblog',isAuthenticated, dashcontroller.addblog);
router.get('/dashboard/editblog',isAuthenticated, dashcontroller.editblog);
router.post('/dashboard/embedblog',upload.single('image'),isAuthenticated, dashcontroller.embedblog);
router.get('/dashboard/deleteblog',isAuthenticated, dashcontroller.deleteblog);


router.get('/dashboard/servicesenquiry', isAuthenticated,dashcontroller.servicesenquiry);
router.get('/dashboard/contact', isAuthenticated,dashcontroller.contact);


module.exports = router;