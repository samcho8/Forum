const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');

router.get('/', (req, res) => {
    res.render('users/login', {failed: false});
});


router.post('/', async(req, res) => {
    console.log(req.sessionID);
    const { username, password } = req.body;
    const user = await pool.query("SELECT user_id FROM users WHERE username = $1",
    [username]);
    const pass = await pool.query("SELECT password FROM users WHERE username = $1",
    [username]);
    if (user["rows"].length == 0 || pass["rows"].length == 0) {
        res.render("users/login", {failed: true});
        return;
    }
    const user_id = user["rows"][0]["user_id"];
    if (req.session.authenticated) {
        res.redirect('/');
        return;
    } else {
        if (!bcrypt.compare(password, pass["rows"][0]["password"]) || !user_id) {
            res.render("users/login", {failed: true});
            return;
        } else {
            req.session.authenticated = true;
            req.session.user = {
                username, password
            };
            res.redirect('/');
            return;
        }
    }
    res.redirect(`/`);
});

module.exports = router;