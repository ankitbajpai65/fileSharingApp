const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    },
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;