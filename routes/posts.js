const express = require('express');
const router = express.Router();
const postBlock = {};

router.get('/', (req, res) => {
    res.render("posts/list", {jsonData: postBlock});
})

router.get('/new', (req, res) => {
    res.render("posts/new");
});

router.post('/', (req, res) => {
    postBlock[req.body.title] = req.body.body;
    res.redirect('/posts');
});

router.post('/delete/:title', (req, res) => {
    console.log(req.params.title);
    delete postBlock[req.params.title];
    res.redirect('/posts');
});
router.route("/:title").get((req, res) => {
   const thisPost = {};
   thisPost[req.params.title] = postBlock[req.params.title];
   res.render("posts/list", {jsonData: thisPost});
})

router.param("id", (req, res, next, id) => {
    req.post = postBlock[title];
    next();
});

module.exports = router;