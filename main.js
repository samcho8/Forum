const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
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
        res.render("index", {user: session["user"]["username"]});
        return;
    }
    res.render("index");
});


const postRouter = require('./routes/posts');

app.use('/posts', postRouter);

const creationRouter = require('./routes/create');

app.use('/create', creationRouter);

const loginRouter = require('./routes/login');

app.use('/login', loginRouter);

app.listen(PORT);