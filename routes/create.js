const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const transporter = require('../transport/transporter');
router.get('/', (req, res) => {
    res.render('users/new_account');
});


router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const password = req.body.password;
    const hashed = await bcrypt.hash(password, salt);
    const username = req.body.username;
    const account = await pool.query("SELECT email FROM users WHERE email = $1",
        [req.body.email]);
    if (account["rows"]["email"] || account["rows"]["username"]) {
        res.send("An account with this email or username already exists");
        return;
    }
    const user = await pool.query("INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING user_id",
        [username, hashed, req.body.email]);
    const user_id = user["rows"][0]["user_id"];
    req.session.authenticated = true;
    req.session.user = {
        username, user_id
    };
    var email = await transporter.sendMail({
        from: "Sam Cho <samchoforum@gmail.com>",
        to: req.body.email,
        subject: "Welcome!",
        text: "Welcome to Sam Cho's Forum App!",
        html: "<p> Welcome to Sam Cho's Forum App! </p>"
    });
    res.redirect('/');
});

router.get("*", (req, res) => {
    res.redirect('/');
});

module.exports = router;