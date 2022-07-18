const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.render("index");
});


const postRouter = require('./routes/posts');

app.use('/posts', postRouter);

const creationRouter = require('./routes/create');

app.use('/create', creationRouter);

app.listen(PORT);