const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('users/login', {failed: false});
});


router.post('/', async(req, res) => {
    const { username, password } = req.body;
    const user = await pool.query("SELECT user_id, password FROM users WHERE username = $1",
    [username]);
    if (user["rows"].length == 0) {
        res.render("users/login", {failed: true});
        return;
    }
    const user_id = user["rows"][0]["user_id"];
    if (req.session.authenticated) {
        res.redirect('/');
        return;
    } else {
        if (!bcrypt.compare(password, user["rows"][0]["password"]) || !user_id) {
            res.render("users/login", {failed: true});
            return;
        } else {
            req.session.authenticated = true;
            req.session.user = {
                username, user_id
            };
            res.redirect('/');
            return;
        }
    }
});

module.exports = router;