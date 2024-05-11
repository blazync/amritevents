// controllers/homeController.js
exports.renderHomePage = (req, res) => {
    // Render the 'home' view using EJS
    res.render('pages/index.ejs', { pageTitle: 'Home Page' });
};
