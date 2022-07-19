const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
router.get('/', (req, res) => {
    res.render('users/login', {failed: false});
});

router.post('/', async(req, res) => {
    const user = await pool.query("SELECT user_id FROM users WHERE username = $1",
    [req.body.username]);
    const password = await pool.query("SELECT password FROM users WHERE username = $1",
    [req.body.username]);
    if (user["rows"].length == 0 || password["rows"].length == 0) {
        res.render("users/login", {failed: true});
        return;
    }
    const user_id = user["rows"][0]["user_id"];
    if (!bcrypt.compare(req.body.password, password["rows"][0]["password"]) || !user_id) {
        res.render("users/login", {failed: true});
        return;
    }
    res.redirect(`/`);
});

module.exports = router;