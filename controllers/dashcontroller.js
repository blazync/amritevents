
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const Enquiry = require('../models/enquiry');
const Category = require('../models/category.js');
const Gallery = require('../models/gallery.js');
const Services = require('../models/services');
const bcrypt = require('bcrypt');
const mailer = require('../controllers/mailcontroller');
const generatePassword = require('generate-password');
const { uploadImage } = require('./uploadImage');
const path = require('path');

exports.login = async (req, res) => {
  if (req.session && req.session.isLoggedIn) {
      // Session is active, render dashboard
      res.redirect('dashboard');
  } else {
      res.render('login');
  }
}
exports.lostpassword = async (req, res) => {
  res.render('lost-password');
}

exports.dashboard = async (req, res) => {
  // Check if session is active
  if (req.session && req.session.isLoggedIn) {
      // Session is active, render dashboard
      res.render('dashboard/');
  } else {
      // Session is not active, redirect to account
      res.redirect('/account');
  }
}


exports.users = async (req, res) => {
  try {
    const users = await User.find();
    res.render('dashboard/users', { users });
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    res.status(500).send('An error occurred while fetching users.');
  }
};

exports.addUser = async (req, res) => {
  const users = await User.find();
  res.render('dashboard/embedUser', { users,type:'add' });
}
exports.editUser = async (req, res) => {
  const userId = req.query.id; 
      if (!userId) {
        return res.status(400).send('User ID is required'); // Send a bad request response if ID is missing
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.render('dashboard/embedUser', { users: user, type:'edit' });
};

exports.embedUser = async (req, res) => {
  try {
    const type = req.body.type;

    if (type === 'add') {
      const { name, role, email, Status } = req.body;
  
      try {
          // Generate a random password
          const password = generatePassword.generate({
            length: 10, // You can adjust the length as needed
            numbers: true,
            symbols: true,
            uppercase: true,
            excludeSimilarCharacters: true,
        });
          console.log(password);
          mailer.sendEmail(email, 'Welcome to our platform!', `
          <p>Hello  ${name},</p>
                         <p>Your username (email) is: ${email}</p>
                         <p>Please use this email to log in to our platform.</p>
                         <p>Your password is: ${password}</p>
                         <p>Please keep this password secure and do not share it with anyone.</p>
                         `);
          // Hash the generated password
          const saltRounds = 10; // Number of salt rounds
          const hashedPassword = await bcrypt.hash(password, saltRounds);
  
          // Create the new user with the generated password
          const newUser = new User({ name, email, role, Status, password: hashedPassword });
          await newUser.save();
          res.redirect('/dashboard/users');
      } catch (error) {
          console.error('Error creating user:', error);
          res.status(500).send('An error occurred while creating user.');
      }
  }
   else {
      const userId = req.query.id; 
      const { name,role,email,Status } = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId,{ name,email,role,Status}, { new: true });
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }
      res.redirect('/dashboard/users');
      }
  } catch (error) {
    // Handle errors
    console.error('Error fetching service:', error);
    res.status(500).send('An error occurred while fetching service.');
  }
};



exports.category = async (req, res) => {
  const category = await Category.find();
  res.render('dashboard/category',{ category });
}
exports.addcategory = async (req, res) => {
  res.render('dashboard/embedcategory',{type:'add',category:'' });
}
exports.deletecategory = async (req, res) => {
  try {
    const serviceId = req.query.id;
    await Category.findByIdAndDelete(serviceId);
    res.redirect('/dashboard/category');
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send('An error occurred while deleting the category.');
  }
};

exports.editcategory = async (req, res) => {
  try {
    const serviceId = req.query.id;
    const category = await Category.findById(serviceId);
    if (!category) {
      return res.status(404).send('Service not found');
    }
    res.render('dashboard/embedcategory', { type: 'edit', category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).send('An error occurred while fetching category.');
  }
}
exports.embedcategory = async (req, res) => {
  try {
    const type = req.body.type;
    if (type === 'add') {
      const type = req.body.type;
      const filepath = req.file ? path.basename(req.file.path) : null;
      const { title ,description,shortdescription,slug } = req.body;
      const newcategory  = new Category ({ title,description,slug,shortdescription ,imageUrl:filepath });
      await newcategory .save();
      res.redirect('/dashboard/category');      
    } else {
      const serviceId = req.query.id;
      const category = await Category.findByIdAndUpdate(serviceId, req.body, { new: true });
      if (!category) {
        return res.status(404).send('Service not found');
      }
      res.redirect('/dashboard/category'); 
      }
  } catch (error) {
    // Handle errors
    console.error('Error fetching service:', error);
    res.status(500).send('An error occurred while fetching service.');
  }
};



exports.services = async (req, res) => {
  const category = await Category.find();
  res.render('dashboard/services',{ category });
}
exports.addservices = async (req, res) => {
  const category = await Category.find();
  res.render('dashboard/embedservices',{ type:'add',category,categoryId:'',subcategory:''});
}
exports.deleteservices = async (req, res) => {
  const { categoryId, subcategoryId } = req.query;
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Find the index of the subcategory within the category's subcategory array
    const subcategoryIndex = category.subcategory.findIndex(sub => sub._id.toString() === subcategoryId);

    if (subcategoryIndex === -1) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    // Retrieve the specific subcategory using the found index
    const foundSubcategory = category.subcategory[subcategoryIndex];

    // Remove the subcategory from the category's subcategory array
    category.subcategory.splice(subcategoryIndex, 1);

    // Save the updated category to the database
    await category.save();

    // Output the updated category (for debugging purposes)
    console.log('Updated Service Category:', category);

      // Log a success message
    console.log('Services/product deleted successfully:', foundSubcategory);

    // Redirect to /dashboard/subcategories
    res.redirect('/dashboard/services');

  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).send('An error occurred while deleting the service.');
  }
};

exports.editservices = async (req, res) => {
  try {
    const categoryall = await Category.find();
    const { categoryId, subcategoryId } = req.query;
    const categories = await Category.findById(categoryId);
    const subcategory = categories.subcategory.id(subcategoryId);
    res.render('dashboard/embedservices', { category:categoryall , subcategory, categoryId,subcategoryId, type: 'edit' });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).send('An error occurred while fetching service.');
  }
}

exports.embedservice = async (req, res) => {
  try {

    const type = req.body.type; 
    if (type === 'add') {
      const { cat_id, name, details,shortdetails,slug } = req.body;
              const imageUrl = req.file ? path.basename(req.file.path) : null;
    
              // Find the category by its ID
              const category = await Category.findById(cat_id);
              if (!category) {
                  return res.status(404).json({ error: 'Category not found' });
              }
          
              const newSubcategory = {
                  name,
                  details,
                  slug,
                  shortdetails,
                  imageUrl, // Use 'images' field name (not 'image') // Assuming you want to set the creation date to now
              };
             
              
              // Push the new subcategory to the category's subcategory array
              category.subcategory.push(newSubcategory);

              // Save the updated category to the database
              await category.save();

              // Log success message
              console.log('New subcategory added:', newSubcategory);

              // Redirect to the dashboard or any other appropriate route
      res.redirect('/dashboard/services');      
    } else {
      const { categoryId, subcategoryId } = req.query;
      const { name, details,shortdetails,slug } = req.body;
      const images = req.file ? req.file.filename : null; // Set images to filename if req.file exists
      
      // Find the category by ID
      const category = await Category.findById(categoryId);
  
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Find the subcategory to update by its ID
      const subcategoryToUpdate = category.subcategory.id(subcategoryId);
  
      if (!subcategoryToUpdate) {
        return res.status(404).json({ error: 'Subcategory not found' });
      }
      console.log("Code reached her")
      // Update subcategory fields
      subcategoryToUpdate.name = name;
      subcategoryToUpdate.shortdetails= shortdetails;
      subcategoryToUpdate.slug= slug;
      subcategoryToUpdate.details = details;
      
      // Check if images are provided and they are different
      if (images && images !== subcategoryToUpdate.images) {
        const imagePath = path.join(__dirname, '../public/upload/', subcategoryToUpdate.images);

      // Check if the image file exists before attempting to delete
      if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Image file deleted successfully');
      }
        subcategoryToUpdate.images = images;
      }
  
      // Save the updated category to the database
      await category.save();
  
      // Log success message
      console.log('Subcategory updated successfully:', subcategoryToUpdate);
  
      // Redirect to the dashboard or any other appropriate route

      res.redirect('/dashboard/services');
      }
  } catch (error) {
    // Handle errors
    console.error('Error fetching service:', error);
    res.status(500).send('An error occurred while fetching service.');
  }
};
// exports.embedservice = async (req, res) => {
//   try {
//     const type = req.body.type;
//     if (type === 'add') {
//       const type = req.body.type;
//       const { name ,description } = req.body;
//       const newService = new Services({ name,description });
//       await newService.save();
//       res.redirect('/dashboard/services');      
//     } else {
//       const serviceId = req.query.id;
//       const service = await Services.findByIdAndUpdate(serviceId, req.body, { new: true });
//       if (!service) {
//         return res.status(404).send('Service not found');
//       }
//       res.redirect('/dashboard/services');
//       }
//   } catch (error) {
//     // Handle errors
//     console.error('Error fetching service:', error);
//     res.status(500).send('An error occurred while fetching service.');
//   }
// };




exports.servicesenquiry = async (req, res) => {
  const enquiries = await Enquiry.find();
  res.render('dashboard/servicesenquiry',{ enquiries });
}


exports.contact = async (req, res) => {
  try {
    // Fetch all enquiries from the database
    const enquiries = await Enquiry.find();

    // Render the 'dashboard/contact' view and pass the enquiries data to it
    res.render('dashboard/contact', { enquiries });
  } catch (error) {
    // Handle errors
    console.error('Error fetching enquiries:', error);
    res.status(500).send('An error occurred while fetching enquiries.');
  }
};


const generateAccessToken = (id, name, role, permissions) => {
  const token_value = {
    userId: id,
    name: name,
    role: role,
    permissions: permissions,
  };
  return jwt.sign(token_value, "secretkey");
};

// Login Logout controller function
exports.loginform = async (req, res) => {
    const {
      email,
      password
    } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({
        email
      });
  
      // Check if user exists
      if (!user) {
        return res.render('error/error',{error:"User Not Found !"})
      }
      if (user.Status == '0') {
        return res.render('error/error',{error:"User Inactive !"})
      }
              // Compare the stored hashed password with the password provided by the user during login
        bcrypt.compare(password,user.password, function(err, result) {
          if (err) {
              // Handle error
              console.error('Error comparing passwords:', err);
              return res.status(500).json({ message: 'An error occurred' });
          }
          if (result) {
            console.log('Login Successfully', user.email);
            req.session.email = user.email;
            req.session.name = user.name;
            req.session.role = user.role;
            req.session.isLoggedIn = true;
            req.session.token = generateAccessToken(user.email,user.name);

            
            console.log(({success: "Successful Login",
            token: generateAccessToken(user.email,user.name),
            }));


            mailer.sendEmail(user.email, 'Welcome to our platform!', `
            <p>Hello ${user.name},</p>
            <p>You have been logged in on behalf of: ${email} at ${new Date().toLocaleString()}</p>
        `);
            if (user.role === '1') {
              return res.redirect('/dashboard');
            } else {
              return res.redirect('/');
            }
          } else {
              // Passwords don't match
              return res.status(401).json({ message: 'Invalid password' });
          }
        });
  
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Login error:', error);
      // return res.status(500).json({ message: 'Internal server error' });
      return res.redirect('/account');
    }
  };
  
  // Logout controller
  exports.logout = (req, res) => {
    const userEmail = req.session.user ? req.session.user.email : 'Unknown';
    console.log(`Logout: ${userEmail}`);

    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({
          message: 'Internal server error'
        });
      }
      // Redirect to the login page or any other page after logout
      res.redirect('/account');
    });
  };

  exports.gallery = async (req, res) => {
    const gallery = await Gallery.find();
    res.render('dashboard/gallery',{ gallery });
  }
 

  exports.addgalleryimage = async (req, res) => {
    const gallery = await Gallery.find();
    res.render('dashboard/embedgallery', { gallery,type:'add' });
  }

  exports.deletegalleryimage = async (req, res) => {
    try {
      const Id = req.query.id;
      await Gallery.findByIdAndDelete(Id);
      res.redirect('/dashboard/gallery');
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).send('An error occurred while deleting the service.');
    }
  }
  exports.embedgallery = async (req, res) => {
    try {
        const type = req.body.type;
        const filetype = req.body.filetype; // Access the selected file type from the dropdown menu
        let filepath;
        if (filetype === 'image') {
            filepath = req.file ? path.basename(req.file.path) : null; // Get the file path from req.file
        } else {
            filepath = req.body.video_link;
        }
        if (type === 'add') {
            try {
                // Save the file path in the database
                const newimages = new Gallery({
                    imageUrl: filepath,
                    filetype:filetype,
                    uploadedBy: req.session.name,
                    uploadedByEmail: req.session.email
                });
                console.log(newimages);
                await newimages.save();

                res.redirect('/dashboard/gallery');
            } catch (error) {
                console.error('Error saving image:', error);
                res.status(500).json({ error: 'An error occurred while saving the image' });
            }
        } else {
            const serviceId = req.query.id;
            const service = await Gallery.findByIdAndUpdate(serviceId, req.body, { new: true });
            if (!service) {
                return res.status(404).send('gallery image not found');
            }
            res.redirect('/dashboard/gallery');
        }
    } catch (error) {
        // Handle errors
        console.error('Error fetching service:', error);
        res.status(500).send('An error occurred while fetching service.');
    }
};
exports.blog = async (req, res) => {
  const blog = await Blog.find();
  res.render('dashboard/blog',{ blog });
}
exports.addblog = async (req, res) => {
  const blog = await Blog.find();
  res.render('dashboard/embedblog',{ blog,type:'add', });
}
exports.deleteblog = async (req, res) => {
  try {
    const Id = req.query.id;
    await Blog.findByIdAndDelete(Id);
    res.redirect('/dashboard/blog');
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).send('An error occurred while deleting the service.');
  }
};

exports.editblog = async (req, res) => {
  try {
    const Id = req.query.id;
    const blog = await Blog.findById(Id);
    if (!blog) {
      return res.status(404).send('blog not found');
    }
    res.render('dashboard/embedblog', { blog, type: 'edit', });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).send('An error occurred while fetching service.');
  }
}
exports.embedblog = async (req, res) => {
  try {
      const type = req.body.type;
      console.log(req.body);

      if (type === 'add') {
          try {
              // Save the blog post in the database
              const newBlog = new Blog({
                  title: req.body.title,
                  content: req.body.content,
                  author: req.body.author,
                  slug:req.body.slug,
                  imageUrl: req.file ? path.basename(req.file.path) : null,
                  tags: req.body.tags.split(',').map(tag => tag.trim()), // Convert comma-separated tags to an array
                  uploadedBy: req.session.name,
                  uploadedByEmail: req.session.email
              });
              console.log('Blog db content which is saving',newBlog);

              await newBlog.save();

              res.redirect('/dashboard/blog');
          } catch (error) {
              console.error('Error saving blog post:', error);
              res.status(500).json({ error: 'An error occurred while saving the blog post' });
          }
      } else {
          const blogId = req.query.id;
          const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true });
          
          if (!updatedBlog) {
              return res.status(404).send('Blog post not found');
          }
          
          res.redirect('/dashboard/gallery');
      }
  } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).send('An error occurred');
  }
};

  
module.exports = exports;