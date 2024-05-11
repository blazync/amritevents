const nodemailer = require('nodemailer');

// Function to send email
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
        
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "blazync@gmail.com",
              pass: "xmyc zilz skxx udyi",
            },
          });

        const mailOptions = {
            from: 'Blazync Technology <blazync@gmail.com>',
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
