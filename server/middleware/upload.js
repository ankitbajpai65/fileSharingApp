const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const credentials = require("../credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// MULTER

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // cb(null, `${Date.now()}-${file.originalname}`);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
}).single("file");

// GOOGLE DRIVE

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

async function googleDriveUpload(authClient, filePath, fileType) {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });

    const fileStream = fs.createReadStream(filePath);

    const file = await drive.files.create({
      resource: {
        name: path.basename(filePath),
        parents: [credentials.parentFolderId],
      },
      media: {
        body: fileStream,
        mimeType: fileType,
      },
      fields: "id",
    });

    const fileId = file.data.id;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Generate a public file URL
    const fileUrl = `https://drive.google.com/file/d/${fileId}/preview`;

    return { fileId, fileUrl };
  } catch (error) {
    console.log("Error uploading file to Google Drive:", error);
    throw error;
  }
}

async function upload(req, res, next) {
  try {
    multerUpload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({ error: "File size limit exceeded (max: 20MB)" });
      } else if (err) {
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "Error uploading file." });
      }

      const authClient = await authorize();

      if (!req.file) return;

      const filePath = req.file.path;
      const fileType = req.file.mimetype;

      const { fileId, fileUrl } = await googleDriveUpload(
        authClient,
        filePath,
        fileType
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted from upload folder.");
        }
      });

      req.fileId = fileId;
      req.fileUrl = fileUrl;
      next();
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error uploading file." });
  }
}

module.exports = { multerUpload, upload };
