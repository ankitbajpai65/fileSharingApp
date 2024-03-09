const express = require('express');
const handleDbConnection = require('./connection');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
const emailRouter = require('./controllers/email')
const dotenv = require('dotenv');
const cors = require('cors');
const verifyToken = require('./middleware/auth')
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
app.use(bodyParser.json());

// DATABASE CONNECTION

const databaseURL = process.env.DATABASE;
handleDbConnection(databaseURL);

// ROUTES

app.get('/', (req, res) => {
    res.send("Welcome to my file sharing app!")
})

app.use('/user', userRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/sendMail', verifyToken, emailRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});