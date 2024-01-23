const express = require('express');
const handleDbConnection = require('./connection');
const dotenv = require('dotenv');
const cors = require('cors');
const upload = require('./middleware/upload');
const FileModel = require('./models/file');

dotenv.config();

const app = express();
app.use(cors());

// DATABASE CONNECTION
const databaseURL = process.env.DATABASE;
handleDbConnection(databaseURL);

// ROUTES
app.get('/', (req, res) => {
    res.send("welcome to my file sharing app!")
})

app.post('/upload', upload.single('file'), async (req, res) => {
    const fileId = req.file.filename;
    // console.log(fileId);

    try {
        await FileModel.create({
            fileName: req.file.filename,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
        });

        const shareableLink = `http://localhost:3000/download/${fileId}`
        return res.json({ link: shareableLink, msg: 'Link send successfully' })
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