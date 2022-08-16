const express = require('express');
const pool = require('../db');
const router = express.Router();

function authRequired(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect('/login');
        return;
    }
    next();
}


router.get('/:category', async (req, res) => {
    const user_id = req.session.user ? req.session.user.user_id : null;
    const posts = await pool.query("SELECT p.*, u.username, COUNT(l) like_count, COALESCE(x.like_dislike, false) like_dislike FROM posts p FULL JOIN likes l ON p.post_id = l.post_id RIGHT JOIN users u ON u.user_id = p.user_id LEFT JOIN (SELECT post_id, like_dislike FROM likes WHERE user_id = $2) x ON x.post_id = p.post_id WHERE category_id = (SELECT category_id FROM categories WHERE category_name = $1) GROUP BY p.post_id, u.username, x.post_id, x.like_dislike;",
        [req.params.category, user_id]);
    if (req.session["user"]) {
        res.render('posts/list', { data: posts["rows"], user: req.session["user"]["username"], category: req.params.category });
        return;
    } 
    res.render('posts/list', { data: posts["rows"], user: 0, category: req.params.category });
})

router.get('/new/:category', authRequired, (req, res) => {
    res.render("posts/new", { category: req.params.category });
});

router.post('/comment/:id/:category', authRequired, async (req, res) => {
    const id = req.params.id;
    const description = req.body.comment;
    const session = req.session;
    const comment = await pool.query('INSERT INTO comments (post_id, description, user_id) VALUES($1, $2, $3)',
        [id, description, session["user"]["user_id"]]);
    res.redirect(`/posts/${req.params.category}`);
});

router.post('/:category', authRequired, async (req, res) => {
    if (!req.body.title) {
        res.status(500).send("cannot create post without a title");
        return;
    }
    const session = req.session;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.params.category;
    const newPost = await pool.query("INSERT INTO posts (title, body, category_id, user_id) VALUES ($1, $2, (SELECT category_id FROM categories WHERE category_name = $3), (SELECT user_id FROM users WHERE username = $4)) RETURNING *",
        [title, body, category, session["user"]["username"]]
    );
    res.redirect(`/posts/${category}`);
});

router.post('/delete/:id/:category', authRequired, async (req, res) => {
    const { id } = req.params;
    const deleted_post = await pool.query("DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING user_id",
        [id, req.session["user"]["user_id"]]);
    if (!deleted_post["rows"][0] || deleted_post["rows"][0]["user_id"] !== req.session["user"]["user_id"]) {
        res.send("You cannot delete a post that doesn't belong to you");
        return;
    }
    res.redirect(`/posts/${req.params.category}`);
});


router.get('/edit/:category/:id', authRequired, async (req, res) => {
    const { id } = req.params;
    const post = await pool.query("SELECT * FROM posts WHERE post_id = $1",
        [req.params.id]);
    if (post["rows"][0]["user_id"] !== req.session["user"]["user_id"]) {
        res.send("You cannot edit a post that doesn't belong to you");
        return;
    }
    res.render('posts/edit', { data: post["rows"][0], category: req.params.category });
});

router.get('/comment/:category/:id', authRequired, async (req, res) => {
    const post = await pool.query("SELECT * FROM posts WHERE post_id = $1",
        [req.params.id]);
    const comments = await pool.query("SELECT * FROM comments WHERE post_id = $1",
        [req.params.id]);
    res.render('posts/comment', { data: post["rows"][0], comments: comments["rows"], category: req.params.category });
});

router.post('/edit/:id/:category', authRequired, async (req, res) => {
    if (!req.body.title) {
        res.redirect('/posts');
        return;
    }
    const id = req.params.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.params.category;
    const updatedPost = await pool.query('UPDATE posts SET title = $1, body = $2 WHERE post_id = $3;',
        [title, body, id]);
    res.redirect(`/posts/${category}`);
});

router.get("/:title", async (req, res) => {
    const post = await pool.query('SELECT * FROM posts WHERE title = $1',
        [req.params.title]);
    res.render('posts/list', { jsonData: post });
});

router.post("/like/:category/:post_id", authRequired, async (req, res) => {
    const { post_id, category } = req.params;
    const like = await pool.query('INSERT INTO likes (post_id, user_id, like_dislike) VALUES($1, $2, true)',
        [post_id, req.session.user.user_id]).catch((error) => {
            return error;
        });
    res.redirect(`/posts/${category}`)
});

router.post("/unlike/:category/:post_id", authRequired, async (req, res) => {
    const { post_id, category } = req.params;
    const like = await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
        [post_id, req.session.user.user_id]).catch((error) => {
            return error;
        });
    res.redirect(`/posts/${category}`)
});

module.exports = router;