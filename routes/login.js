const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('users/login', {failed: false});
});

router.post('/', async(req, res) => {
    const user = await pool.query("SELECT user_id FROM users WHERE username = $1",
    [req.body.username]);
    const user_id = user["rows"][0]["user_id"];
    const password = await pool.query("SELECT password FROM users WHERE user_id = $1",
    [user_id]);
    if (password["rows"][0]["password" != req.body.password] || !user_id) {
        res.render("/users/login", {failed: true});
    }
    res.redirect(`/t/${user_id}`);
});

module.exports = router;