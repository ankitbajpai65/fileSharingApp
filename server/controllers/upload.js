const FileModel = require('../models/file');

const SIZE_UNITS = ['bytes', 'KB', 'MB', 'GB', 'TB'];

const handleFileUpload = async (req, res) => {
    const fileId = req.file.filename;
    const token = req.cookies.filegem_token;

    let fileSize = req.file.size;
    let count = 0;

    while (fileSize >= 1024 && count < SIZE_UNITS.length - 1) {
        fileSize /= 1024;
        count++;
    }

    const formattedFileSize = `${fileSize.toFixed(2)} ${SIZE_UNITS[count]}`;

    try {
        if (!token) {
            return res.json({ status: "error", msg: 'Token is missing' })
        }
        await FileModel.create({
            fileName: req.file.filename,
            fileSize: formattedFileSize,
            fileType: req.file.mimetype,
            user: req.body.user
        });

        const shareableLink = `${process.env.BASE_URL}/download/${fileId}`;
        return res.json({ link: shareableLink, fileSize: req.file.size, msg: 'Link send successfully' })
    } catch (err) {
        console.log(err);
        return res.json({ error: err })
    }
}

module.exports = { handleFileUpload };