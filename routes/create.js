const express = require('express');
const pool = require('../db');
const router = express.Router();
const mailer = require("nodemailer");
const bcrypt = require('bcrypt');
router.get('/', (req, res) => {
    res.render('users/new_account');
});

router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(20);
    const password = req.body.password;
    const hashed = await bcrypt.hash(password, salt);
    const username = req.body.username;
    const user = await pool.query("INSERT INTO users (username, password, email) VALUES($1, $2, $3)",
    [username, hashed, req.body.email]);
    req.session.authenticated = true;
    req.session.user = {
        username, password
    };
    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'samchoforum@gmail.com',
            pass: 'izctlvdzdwnyfgtl'
        }
    });
    var email = await transporter.sendMail({
       from: "Sam Cho <samchoforum@gmail.com>",
       to: req.body.email,
       subject: "Welcome!",
       text: "Welcome to Sam Cho's Forum App!",
       html: "<p> Welcome to Sam Cho's Forum App! </p>" 
    });
    res.redirect('/');
});

module.exports = router;