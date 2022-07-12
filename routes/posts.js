const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/:category', async (req, res) => {
    const posts = await pool.query("SELECT * FROM post WHERE category_id = $1", 
    [req.params.category]);
    res.render("posts/list", { data: posts["rows"], category: req.params.category });
})

router.get('/new/:category', (req, res) => {
    res.render("posts/new", {category: req.params.category});
});

router.post('/comment/:id/:category', async (req, res) => {
    const id = req.params.id;
    const description = req.body.comment;
    const comment = await pool.query('INSERT INTO comments (post_id, description) VALUES($1, $2)',
    [id, description]);
    res.redirect(`/posts/${req.params.category}`);
});

router.post('/:category', async (req, res) => {
    if (!req.body.title) {
        res.status(500).send("cannot create post without a title");
        return;
    }
    const title = req.body.title;
    const body = req.body.body;
    const category = req.params.category;
    const newPost = await pool.query("INSERT INTO post (title, body, category_id) VALUES ($1, $2, $3) RETURNING *",
        [title, body, category]
    );
    res.redirect(`/posts/${category}`);
});

router.post('/delete/:id/:category', async (req, res) => {
    const { id } = req.params;
    const deleted_comments = await pool.query("DELETE FROM comments WHERE post_id = $1",
    [id]);
    const deleted_post = await pool.query("DELETE FROM post WHERE post_id = $1",
    [id]);
    res.redirect(`/posts/${req.params.category}`);
});


router.get('/edit/:id', async (req, res) => {
    const post = await pool.query("SELECT * FROM post WHERE post_id = $1",
    [req.params.id]);
    res.render('posts/edit', { data: post["rows"][0], category: post["rows"][0]["category_id"] });
});

router.get('/comment/:id', async (req, res) => {
    const post = await pool.query("SELECT * FROM post WHERE post_id = $1",
    [req.params.id]);
    const comments = await pool.query("SELECT * FROM comments WHERE post_id = $1",
    [req.params.id]);
    res.render('posts/comment', {data: post["rows"][0], comments: comments["rows"], category: post["rows"][0]["category_id"]});
});

router.post('/edit/:id/:category', async (req, res) => {
    if (!req.body.title) {
        res.redirect('/posts');
        return;
    }
    console.log(req.params);
    const id = req.params.id;
    const title = req.body.title;
    const body = req.body.body;
    const updatedPost = await pool.query('UPDATE post SET title = $1, body = $2 WHERE post_id = $3;',
    [title, body, id]);
    res.redirect(`/posts/${category}`);
});

router.get("/:title", async (req, res) => {
    const post = await pool.query('SELECT * FROM post WHERE title = $1',
    [req.params.title]
    );
    res.render('posts/list', { jsonData: post});
});

module.exports = router;