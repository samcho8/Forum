const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("List of posts")
})

router.get('/new', (req, res) => {
    res.send("new form");
});

router.post('/', (req, res) => {
    res.send("creation");
});

router.route("/:id").get((req, res) => {
    res.send("get specific post");
}).put((req, res) => {
    res.send("creation of a post with id");
}).delete((req, res) => {
    res.send("deletion of post of id");
});

const posts = { title: "body" };
router.param("id", (req, res, next, id) => {
    req.user = posts[title];
    next();
});

module.exports = router;