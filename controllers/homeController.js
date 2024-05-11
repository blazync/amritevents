// controllers/homeController.js
exports.renderHomePage = (req, res) => {
    // Render the 'home' view using EJS
    res.render('pages/index.ejs', { pageTitle: 'Home Page' });
};

exports.renderServicesPage = (req,res)=>{
    // Render the 'services' view using EJS
    res.render('pages//services/index.ejs', { pageTitle: 'Services Page' });
}
