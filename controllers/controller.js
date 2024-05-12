const Enquiry = require('../models/enquiry');
const Services = require('../models/services');
const Gallery = require('../models/gallery');
const Blog = require('../models/blog');
const mailer = require('../controllers/mailcontroller');
const Category = require('../models/category.js');

exports.index = async (req, res) => {
    const services = await Services.find();
    const gallery = await Gallery.find();
    const category = await Category.find();
    const blog = await Blog.find();
    res.render('index', { service: services,blog,gallery,category });
}
exports.aboutus = async (req, res) => {
    const category = await Category.find();
    res.render('aboutus',{category});
}
exports.pose = async (req, res) => {
    const category = await Category.find();
    res.render('pose',{category});
}
exports.gallery = async (req, res) => {
    const type = req.query.type?req.query.type:null;
    const gallery = await Gallery.find();
    const category = await Category.find();
    res.render('gallery',{ gallery,type,category });
}

exports.services = async (req, res) => {
    const servicesname = req.params.servicesname;
   try {
        if (servicesname) {
            const category = await Category.find();
            const service = await Category.findOne({ title: servicesname });
            if (!service) {
                res.render('services');
            }
            res.render('servicesdetails', { service,category });
        } else {
            const category = await Category.find();
            const service = await Category.find();
            res.render('services', { service,category });
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).render('error');
    }
};
// Change this and setup service category accordingly
exports.corporate = async (req, res) => {
    res.render('services/corporate');
}
exports.contact = async (req, res) => {
    const category = await Category.find();
    res.render('contact',{category});
}
exports.contactform = async (req, res) => {

    const data = req.body;
    console.log(data);
    try {
        
      const enquiry = new Enquiry(data); 
      await enquiry.save();
      console.log(enquiry);
      mailer.sendEmail(enquiry.email?enquiry.email:'', 'Thanks for showing intrest', `
      <p>Hello  ${enquiry.name},</p>
                     <p>Thanks for showing intrest. our representative call you back shortly <br> Thanks and Regards <br> Sawadhyatmik.</p>
                     `);
      res.redirect(req.headers.referer || '/');
      console.log('Enquiry submitted successfully!');
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      res.status(500).send('An error occurred while processing your enquiry.');
    }
  };
// Controller function
exports.blog = async (req, res) => {

    const title = req.query.title;
   if(title){
    try {
        
        const blog = await Blog.findOne({ title: title });
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.render('blogview', { blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).send('An error occurred while fetching the blog.');
    }
   }else{
    const category = await Category.find();
    const blog = await Blog.find();
        res.render('blog', { blog,category });
   }
};

exports.login = async (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        // Session is active, render dashboard
        res.redirect('dashboard');
    } else {
        const category = await Category.find();
        res.render('login',{category});
    }
}
exports.lostpassword = async (req, res) => {
    res.render('lost-password');
}
module.exports = exports;