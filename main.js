const express = require('express');
var posts = {hello: "Lfsdfsdf"};
const app = express();
const PORT = 3000;
app.use(express.json());
app.set('view engine', 'ejs');
app.get('/', (req, res, next) => {
    res.render("index", posts['hello']);
});

const createPost = (title, body) => {

}

const postRouter = require('./routes/posts');

app.use('/posts', postRouter);
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})