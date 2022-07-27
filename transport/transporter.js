const mailer = require("nodemailer");
var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samchoforum@gmail.com',
        pass: 'izctlvdzdwnyfgtl'
    }
});
module.exports = transporter;