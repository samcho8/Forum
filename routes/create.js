const express = require('express');
const pool = require('../db');
const router = express.Router();
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
    res.redirect('/');
});

module.exports = router;