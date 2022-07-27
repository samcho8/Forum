const mailer = require("nodemailer");
const dotenv = require("dotenv").config();

var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samchoforum@gmail.com',
        pass: dotenv["parsed"]["MAILPASS"]
    }
});
module.exports = transporter;