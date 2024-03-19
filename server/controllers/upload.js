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
            googleDriveId: req.fileId,
            fileSize: formattedFileSize,
            fileType: req.file.mimetype,
            user: req.body.user
        });

        scheduleFileDeletion(req.fileId);

        const shareableLink = `${process.env.BASE_URL}/download/${fileId}`;
        return res.json({
            link: shareableLink,
            googleDriveId: req.fileId,
            fileSize: req.file.size,
            msg: 'Link send successfully'
        })
    } catch (err) {
        console.log(err);
        return res.json({ error: err })
    }
}

async function deleteFileFromDatabase(googleDriveId) {
    try {
        await FileModel.deleteOne({ googleDriveId: googleDriveId });
        console.log("File details deleted from database:");
    } catch (error) {
        console.log("Error deleting file details from database:", error);
        throw error;
    }
}

function scheduleFileDeletion(googleDriveId) {
    setTimeout(async () => {
        try {
            await deleteFileFromDatabase(googleDriveId);
        } catch (error) {
            console.error("Error scheduling file deletion:", error);
        }
    }, 24 * 60 * 60 * 1000);
}

module.exports = { handleFileUpload };