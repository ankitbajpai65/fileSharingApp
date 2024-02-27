const express = require('express');
const handleDbConnection = require('./connection');
const userRouter = require('./routes/user');
const dotenv = require('dotenv');
const cors = require('cors');
const upload = require('./middleware/upload');
const FileModel = require('./models/file');
const email = require('./controllers/email')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// DATABASE CONNECTION
const databaseURL = process.env.DATABASE;
handleDbConnection(databaseURL);

app.use(bodyParser.json());
app.use('/sendMail', email);

// ROUTES

app.get('/', (req, res) => {
    res.send("Welcome to my file sharing app!")
})

app.use('/user', userRouter);

app.post('/upload', upload.single('file'), async (req, res) => {
    const fileId = req.file.filename;

    try {
        await FileModel.create({
            fileName: req.file.filename,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            user:req.body.user
        });

        const shareableLink = `${process.env.BASE_URL}/download/${fileId}`;
        return res.json({ link: shareableLink, fileSize: req.file.size, msg: 'Link send successfully' })
    } catch (err) {
        console.log(err);
        return res.json({ error: err })
    }
})

app.get('/download/:id', (req, res) => {
    const fileId = req.params.id;
    const filePath = `uploads/${fileId}`;

    res.download(filePath);
})


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});