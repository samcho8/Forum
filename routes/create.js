const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('users/new_account');
});

router.post('/', async (req, res) => {
    const user = await pool.query("INSERT INTO users (username, password, email) VALUES($1, $2, $3)",
    [req.body.username, req.body.password, req.body.email]);
    res.redirect('/');
});

module.exports = router;