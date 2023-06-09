const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./mdoels/User');
const Post = require('./mdoels/Post');
const fs = require('fs');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // A library to help you hash passwords.
const cookieParser = require('cookie-parser');
const multer = require('multer'); //Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const { findById } = require('./mdoels/User');
const uploadMiddleware = multer({ dest: 'uploads/' })

const salt = bcrypt.genSaltSync(10);
const secret = 'bhjbdjwj3b34b43bhj42jjsjjhbjdcjwa';

//middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json()); //json parser
app.use(cookieParser()); //cookie parser
app.use('/uploads', express.static(__dirname + '/uploads')); //to use static files

//connectiong to db
mongoose.connect('mongodb+srv://blog:EWH1Mr0MJaEzdFC8@cluster0.oc3n3ga.mongodb.net/?retryWrites=true&w=majority')

//routes
// to register users to our db
app.post('/register', async (req, res) => {
    // console.log(req.body);
    const { username, password } = req.body;
    try {
        // to handle unique users registration, use try-catch
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
        console.log(userDoc);
    } catch (error) {
        res.status(400).json(error);
    }

})


// handle login page : Authentication
/*
todo :what we are going to do
1) check username, password in post(login) request
2) if both exists create new JSON WEB TOKEN (JWT)
3) send back to front end
4) setup authentication, so only the request with JWT can access the dashboard.
*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username: username })
    //now to verify the password user is inserting, we need to compare the password that is encrypted by bcrypt and stored in our db(userDoc.password) with the password user is inserting(password)
    const passOk = bcrypt.compareSync(password, userDoc.password); // true-if pass matches else false
    if (passOk) {
        //logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            //saving jwt created of user as cookie
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
            //token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InByaXR1IiwiaWQiOiI2NDExYmZhNGZmY2ExNmE1NDQ5NzBjZWQiLCJpYXQiOjE2Nzg4ODgyMDV9.cv4ENQqQPkVCfKVY4P4lbIEmzqZ0q51aemAYakbk_yw; 
        });

    } else {
        res.status(404).json('wrong credentials');
    }

})

//Checking if logged in :We are logged in, so we need to hide the login tab from header on the home page. For that we need to know, we know we are logged in? We have cookie a token inside our cookie but anyone can have cookie set in browsers so we need to check this token if it is valid.
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, decodedInfo) => {
        if (err) throw err;
        res.json(decodedInfo);
    })
})


//HANDLING LOGOUT FUNCTIONALITY:we want to invalidate the cookie, so we can reset the cookie
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

//handling create new post route to post new blog
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    //now to grab the FormData specifically file that is in binary format from request, we will use multer library and its middleware
    const { originalname, path } = req.file;
    //image grabbed from req.file has no extension, so we have to insert the extension to get original image
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies; // to grab author name from jwt token that is stored in cookie
    jwt.verify(token, secret, {}, async (err, decodedInfo) => {
        if (err) throw err;
        //now we want everything from payload(title,summary,content,file) that is in req.body to store in our db
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: decodedInfo.id,
        })
        res.json(postDoc);
    })

})

//Displaying single post from the database
app.get('/post', async (req, res) => {
    const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20); //sorting the post in descending order, so latest post shows at the top //limit : Specifies the maximum number of documents the query will return
    res.json(posts);
})


app.get('/post/:id', async (req, res) => {
    const { id } = req.params; //now with this id we want to fetch the post from our database
    //since we just get author with id, to get additional information such as username we have to use populate method
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

//handling edit route
app.get('/edit/:id', async (req, res) => {
    const { id } = req.params; //now with this id we want to fetch the post from our database
    //since we just get author with id, to get additional information such as username we have to use populate method
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})


app.put('/post', uploadMiddleware.single('file'), (req, res) => {
    // res.json({files:req.file});
    let newPath = null; //if wa have req.file then we will rename it
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const { token } = req.cookies; // to grab author name from jwt token that is stored in cookie
    jwt.verify(token, secret, {}, async (err, decodedInfo) => {
        if (err) throw err;
        //now we want everything from payload(title,summary,content,file) that is in req.body to store in our db
        const { title, summary, content, id } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(decodedInfo.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        })
        res.json(postDoc);
    })

})
app.listen(4000, () => {
    console.log('Server is listening on port 4000')
});


