const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
router.get('/', (req, res) => {
    res.render('users/new_account');
});

router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(20);
    const hashed = await bcrypt.hash(req.body.password, salt);
    console.log(hashed);
    const user = await pool.query("INSERT INTO users (username, password, email) VALUES($1, $2, $3)",
    [req.body.username, hashed, req.body.email]);
    res.redirect('/');
});

module.exports = router;