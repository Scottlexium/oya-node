const express = require("express");
const ProgressBar = require('progress')
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'view');

const port = process.env.PORT || 4000;

const dbURI = 'mongodb+srv://Scottlexium:Lawrentus@node-tuts.vjfwz.mongodb.net/node-db?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(port);
        console.log(`Connected: Listening on port ${port}`);
    })
    .catch((err) => console.log(err));



app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'))

const bar = new ProgressBar(':bar', { total: 10 })
const timer = setInterval(() => {
  bar.tick()
  if (bar.complete) {
    clearInterval(timer)
  }
}, 100)



// app.get('/', (req, res) => {
//     res.render('index', {title: 'Home', blogs});
// });

app.get('/', (req, res)=>{
    res.redirect('blogs');
});

app.get('/blogs',(req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then((result)=>{
        res.render('index', {title: 'New blogs', blogs: result})
    }).catch((err)=>{
        console.log(err);
    })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
    .then((result) =>{
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    });
})

app.get('/blogs/:id', (req, res)=>{
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
    .then(result => {
        res.render('details', {blog: result, title: 'Blog with mongoose'});
    }).catch((err)=>{
        console.log(err);
    })
})


app.delete('/blogs/:id', (req, res) =>{
    const id = req.params.id;;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect: '/'})
    }).catch((err)=>{
        console.log(err);
    })
})

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

app.get('/create', (req, res)=>{
    res.render('create', {title: 'Create New Post'});
})

app.get('/error', (req, res) => {
    res.render('404', {title: 'page not found'});
});

app.use((req, res)=>{
    res.status(400).render('404', {title: 'page not found'});
})

