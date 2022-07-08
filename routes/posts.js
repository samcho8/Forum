const express = require('express');
const pool = require('../db');
const router = express.Router();
const postContainer = {};
var id = 0; // key posts by id, increment by 1 for now, but need to do differently later

router.get('/', async (req, res) => {
    const posts = await pool.query("SELECT * FROM post ORDER BY post_id asc");
    res.render("posts/list", { jsonData: posts["rows"] });
})

router.get('/new', (req, res) => {
    res.render("posts/new");
});

router.post('/', async (req, res) => {
    if (!req.body.title) {
        res.status(500).send("cannot create post without a title");
        return;
    }
    const title = req.body.title;
    const body = req.body.body;
    const newPost = await pool.query("INSERT INTO post (title, body) VALUES ($1, $2) RETURNING *",
        [title, body]
    );
    /*postContainer[id] = {};
    postContainer[id][req.body.title] = req.body.body; 
    id += 1;*/
    res.redirect('/posts');
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await pool.query("DELETE FROM post WHERE post_id = $1",
    [id]);
    res.redirect('/posts');
});

router.get('/edit/:id', async (req, res) => {
    const post = await pool.query("SELECT * FROM post WHERE post_id = $1",
    [req.params.id]);
    res.render("posts/edit", { data: post["rows"][0] });
});


router.post('/edit/:id', (req, res) => {
    if (!req.body.title) {
        delete postContainer[req.params.id];
        res.redirect('/posts');
        return;
    }
    const id = req.params.id;
    const title = req.body.title;
    const body = req.body.body;
    const updatedPost = pool.query("UPDATE post SET title = $1, body = $2 WHERE post_id = $3",
    [title, body, id]);
    res.redirect('/posts');
});
router.get("/:id", (req, res) => {
    const post = pool.query("SELECT * FROM post WHERE post_id == $1",
    [req.params.id]
    );
    res.render("posts/list", { jsonData: post});
});

router.param("id", (req, res, next, id) => {
    req.post = postContainer[id];
    next();
});

module.exports = router;