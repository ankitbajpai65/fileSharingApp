const FileModel = require('../models/file');

const handleFileUpload = async (req, res) => {
    const fileId = req.file.filename;
    const token = req.cookies.filegem_token;

    try {
        if (!token) {
            return res.json({ status: "error", msg: 'Token is missing' })
        }
        await FileModel.create({
            fileName: req.file.filename,
            fileSize: req.file.size,
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