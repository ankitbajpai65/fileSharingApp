const path = require('path');

const handleFileDownload = async (req, res) => {
    const fileId = req.params.id;
    // const filePath = `../uploads/${fileId}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileId);

    res.download(filePath);
}

module.exports = { handleFileDownload };