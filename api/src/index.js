const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');

const db = require('./config/db')
const app = express();
const multer = require('multer');
const path = require('path');

// Connect to DB
db.connect();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(helmet());
app.use(morgan('common'));
app.use(cors());

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

const storage_post = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/images/post')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload_post = multer({ storage: storage_post });
app.post('/api/upload/post', upload_post.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully!!!")
    } catch (err) {
        console.log('err:', err)
    }
})

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the show</h1>")
})

app.get('/users', (req, res) => {
    res.send("<h1>Hello Astral</h1>")
})

app.listen(8800, () => {
    console.log("Backend server is running!");
})

