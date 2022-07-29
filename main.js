const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv').config();
const store = new session.MemoryStore();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "views")));
}

app.use(session({
    secret: 'cookie_secret',
    cookie: { maxAge: 300000 },
    saveUninitialized: false,
    store,
    resave: true
}));


app.get('/', (req, res) => {
    var session = req.session;
    if (session.authenticated) {
        res.render("index", { user: session["user"]["username"] });
        return;
    }
    res.render("index");
});

app.get('/logout', (req, res) => {
    req.session.authenticated = false;
    res.redirect('/');
});

const postRouter = require('./routes/posts');

app.use('/posts', postRouter);

const creationRouter = require('./routes/create');

app.use('/create', creationRouter);

const loginRouter = require('./routes/login');

app.use('/login', loginRouter);

app.listen(PORT);