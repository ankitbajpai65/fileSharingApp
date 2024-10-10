"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import config from "../../../next.config";
import "../Home/Home.css";
import "./Download.css";
import FileViewer from "../FileViewer";
import Loader from "../Home/Loader";
import PreviewIcon from "@mui/icons-material/Preview";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const BASE_URL = config.env.BASE_URL;

const Download = () => {
  const pathname = usePathname();
  const [isDownloadBtnClicked, setIsDownloadBtnClicked] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const file = pathname.split("/")[2];

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleOpen = () => setShowFile(true);
  const handleClose = () => setShowFile(false);

  const handleAlertClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const handleDownloadBtn = async () => {
    setIsDownloadBtnClicked(true);
    try {
      const response = await fetch(`${BASE_URL}/download/${file}`);

      if (response.ok) {
        const filename = "filegem";
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const res = await response.json();
        console.error(`Failed to download file. Status: ${response.status}`);
        setState((prev) => ({ ...prev, open: true }));
      }
      setTimeout(() => setIsDownloadBtnClicked(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getFileUrl = async () => {
    if (!fileUrl) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/download/files/${file}/url`);
        const res = await response.json();

        if (res.status === "ok") {
          setFileUrl(res.fileUrl);
          handleOpen();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else handleOpen();
  };

  if (loading) return <Loader />;

  return (
    <>
      <section className="downloadSection">
        <div className="homeBox downloadBox">
          <div className="imgContainer">
            <img src="/icon.png" alt="" />
          </div>
          <h2>Your file is ready to download</h2>
          <small>Link will expire in 24 hrs</small>
          <p className="fileName">{file}</p>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Button
              variant="contained"
              onClick={getFileUrl}
              className="downloadBtn"
              endIcon={<PreviewIcon />}
            >
              View File
            </Button>
            <Button
              variant="contained"
              onClick={() => handleDownloadBtn()}
              className="downloadBtn"
              endIcon={<FileDownloadIcon />}
            >
              {isDownloadBtnClicked ? "Downloading..." : "Download File"}
            </Button>
          </Box>
        </div>
      </section>

      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ bgcolor: "#323232", color: "var(--lightColor)" }}
        >
          The link has been expired or is incorrect!
        </Alert>
      </Snackbar>

      {showFile && (
        <FileViewer
          open={showFile}
          handleClose={handleClose}
          fileUrl={fileUrl}
        />
      )}
    </>
  );
};

export default Download;
