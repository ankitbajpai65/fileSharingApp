const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const FileModel = require("../models/file.js");
const User = require("../models/user");
const credentials = require("../credentials.json");

const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
  );
  await jwtClient.authorize();
  return jwtClient;
}

const handleFileDownload = async (req, res) => {
  const fileName = req.params.id;

  // checking in db
  const file = await FileModel.findOne({ fileName });

  if (!file) {
    return res.status(404).json({
      status: "error",
      message: "The link has expired or is incorrect!",
    });
  }

  // operations in google drive
  const authClient = await authorize();
  const drive = google.drive({ version: "v3", auth: authClient });

  const dest = fs.createWriteStream(
    path.join(__dirname, "..", "downloads", fileName)
  );

  drive.files.get(
    { fileId: file.googleDriveId, alt: "media" },
    { responseType: "stream" },
    function (err, response) {
      if (err) {
        console.log("Error retrieving file from Google Drive:", err);
        return res.status(500).send("Error retrieving file from Google Drive");
      }

      response.data
        .on("end", () => {
          console.log("Done");
        })
        .on("error", (err) => {
          console.log("Error downloading file:", err);
          return res.status(500).send("Error downloading file");
        })
        .pipe(dest);

      setTimeout(() => {
        res.download(path.join(__dirname, "..", "downloads", fileName), () => {
          fs.unlinkSync(path.join(__dirname, "..", "downloads", fileName));
          console.log("File deleted from download folder");
        });
      }, 2000);
    }
  );
};

const getFileUrl = async (req, res) => {
  const fileName = req.params.fileName;

  const file = await FileModel.findOne({ fileName: fileName });

  if (!file) {
    return res.status(404).json({
      status: "error",
      message: "File not found",
    });
  }

  const fileUrl = `https://drive.google.com/file/d/${file.googleDriveId}/preview`;

  if (fileUrl)
    return res.status(200).json({
      status: "ok",
      fileUrl: fileUrl,
    });
  else
    return res.status(400).json({
      status: "error",
      message: "Some error ocurred",
    });
};

module.exports = { handleFileDownload, getFileUrl };
