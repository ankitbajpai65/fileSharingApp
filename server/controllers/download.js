const path = require('path');
const fs = require("fs");
const { google } = require('googleapis');
const FileModel = require("../models/file.js")
const credentials = require('../credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPES
    )
    await jwtClient.authorize();
    return jwtClient;
}

const handleFileDownload = async (req, res) => {
    const fileName = req.params.id;
    console.log(fileName)

    const file = await FileModel.findOne({ fileName })

    if (!file) {
        return res.status(404).json({
            status: 'error',
            message: 'Link has been expired',
        })
    }

    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const dest = fs.createWriteStream(path.join(__dirname, "..", "downloads", fileName));

    drive.files.get({ fileId: file.googleDriveId, alt: 'media' }, { responseType: 'stream' },
        function (err, response) {
            if (err) {
                console.log('Error retrieving file from Google Drive:', err);
                return res.status(500).send('Error retrieving file from Google Drive');
            }

            response.data
                .on('end', () => {
                    console.log('Done');
                })
                .on('error', err => {
                    console.log('Error downloading file:', err);
                    return res.status(500).send('Error downloading file');
                })
                .pipe(dest);

            setTimeout(() => {
                res.download(path.join(__dirname, "..", "downloads", fileName), () => {
                    fs.unlinkSync(path.join(__dirname, "..", "downloads", fileName));
                    console.log("File deleted from download folder");
                });
            }, 2000)
        }
    );
}

module.exports = { handleFileDownload };