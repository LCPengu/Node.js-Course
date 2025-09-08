//email
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1. Create a transporter
  const transporter = nodemailer.createTransport({
    //sending emails using gmail(theres a limit to 500 a day)
    /* service: 'gmail',
    auth: {
      user: '@gmail.com',
      pass: 'the',
    }, */
    //activate in gmail "less secure app" option
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2. Define the email options
  const mailOptions = {
    from: 'Leon <Leon@mail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
