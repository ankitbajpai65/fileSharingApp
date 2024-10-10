"use client";
import { useState, useRef, useContext, useEffect } from "react";
import {
  Typography,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useFormik } from "formik";
import EmailSchema from "./validationSchema";
import { AppContext } from "@/app/context/AppContext";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import "./Home.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import FileViewer from "../FileViewer";
import SendIcon from "@mui/icons-material/Send";

const BASE_URL = process.env.BASE_URL;

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -25],
            },
          },
        ],
      },
    }}
  />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none",
  },
});

const Home = () => {
  const fileInputRef = useRef(null);
  const linkRef = useRef(null);
  const router = useRouter();
  // const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [showLink, setShowLink] = useState(false);

  const [fileData, setFileData] = useState({
    fileLink: "Generating link...",
    fileUrl: "",
    fileSize: "",
  });
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: "",
  });
  const [showFile, setShowFile] = useState(false);

  const { vertical, horizontal, open } = state;
  const { isUserLoggedin, userData, isLoading } = useContext(AppContext);

  useEffect(() => {
    if (!isUserLoggedin && isLoading) {
      router.push("/");
    }
  }, []);

  const handleOpen = () => setShowFile(true);
  const handleClose = () => setShowFile(false);

  const handleAlertClose = () => {
    setState({
      ...state,
      open: false,
      type: "",
    });
  };

  const handleBrowseClick = async () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files) {
      // setUploadedFile(files[0]);
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("user", userData.id);

      handleFileUpload(formData);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // setUploadedFile(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("user", userData.id);

      handleFileUpload(formData);
    }
  };

  async function handleFileUpload(formData) {
    setFileData({
      fileLink: "Generating link...",
      fileSize: "",
      fileUrl: "",
    });
    try {
      setUploadPercentage(0);

      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setUploadPercentage(percent);
        },
        withCredentials: true,
      });

      const data = await res.data;
      console.log(data);

      if (data.error === "File size limit exceeded (max: 20MB)") {
        setState((prev) => ({
          ...prev,
          open: true,
          message: "File is too large (max:30MB)",
          type: "error",
        }));
        // setUploadedFile(null);
      } else {
        setFileData({
          fileLink: data.link,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
        });
        setUploadPercentage(100);
        setShowLink(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCopyClick = () => {
    linkRef.current.select();

    try {
      navigator.clipboard.writeText(fileData.fileLink);
      setState((prev) => ({
        ...prev,
        open: true,
        message: "Link copied!",
        type: "success",
      }));
    } catch (err) {
      console.error("Unable to copy link to clipboard");
    }
  };

  const handleSharing = async () => {
    try {
      await navigator.share({
        title: "Filegem",
        text: "Download url of a file",
        url: fileData.fileLink,
      });
    } catch (err) {
      console.error("error:", err.message);
    }
  };

  const handleSendMail = async (values) => {
    setState((prev) => ({
      ...prev,
      open: true,
      message: "Email sent!",
      type: "success",
    }));
    try {
      const res = await fetch(`${BASE_URL}/sendMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          toEmail: values.receiversMail,
          fromEmail: values.sendersMail,
          fileLink: fileData.fileLink,
          fileSize: fileData.fileSize,
          user: userData.name,
        }),
      });
      const data = res.json();
      console.log(data);
    } catch (error) {
      console.log(`Error sending email : ${error}`);
    }
  };

  const formik = useFormik({
    initialValues: {
      sendersMail: "",
      receiversMail: "",
    },
    validationSchema: EmailSchema,
    onSubmit: handleSendMail,
  });

  return (
    <>
      <section className="homeSection homeContainer">
        <div
          style={{ padding: `${showLink && "2rem"}` }}
          className={`${
            uploadPercentage > 0
              ? "homeBox dropZone uploadBox"
              : "homeBox dropZone"
          }`}
          id="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="imgContainer">
            <img src="/icon.png" alt="" onClick={handleBrowseClick} />
          </div>
          <div>
            <span>Drop your file here, or</span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button className="browseBtn" onClick={handleBrowseClick}>
              Browse
            </button>
          </div>

          {!showLink && uploadPercentage > 0 && (
            <>
              <p className="uploadedChunk">Uploading {uploadPercentage}%</p>
              <div
                className="uploadLoader"
                style={{ width: `${uploadPercentage}%` }}
              ></div>
            </>
          )}

          {showLink && (
            <div className="fileUploadedContainer">
              <small>Link expires in 24 hrs</small>
              <NoMaxWidthTooltip title={fileData.fileLink} placement="top">
                <div className="fileLinkDiv">
                  <span className="fileLink">{fileData.fileLink}</span>
                  <input
                    ref={linkRef}
                    type="text"
                    value={fileData.fileLink}
                    readOnly
                    style={{ display: "none" }}
                  />
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      aria-label="view"
                      onClick={handleOpen}
                      disabled={
                        fileData.fileLink === "Generating link..." && true
                      }
                      className="viewBtn"
                    >
                      <VisibilityIcon sx={{ color: "white" }} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={handleCopyClick}
                      disabled={
                        fileData.fileLink === "Generating link..." && true
                      }
                      className="copyBtn"
                    >
                      <ContentCopyIcon sx={{ color: "white" }} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={handleSharing}
                      disabled={
                        fileData.fileLink === "Generating link..." && true
                      }
                      className="shareBtn"
                    >
                      <ShareIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Box>
                </div>
              </NoMaxWidthTooltip>
              <p>Or send via Email</p>
              <form>
                <input
                  type="email"
                  placeholder="Your email"
                  name="sendersMail"
                  value={formik.values["sendersMail"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["sendersMail"] &&
                    Boolean(formik.errors["sendersMail"])
                  }
                  helperText={
                    formik.touched["sendersMail"] &&
                    formik.errors["sendersMail"]
                  }
                />
                {formik.touched.sendersMail && formik.errors.sendersMail && (
                  <Typography
                    variant="subtitle2"
                    color="error"
                    sx={{
                      marginTop: "-9px",
                      paddingLeft: "14px",
                      textAlign: "start",
                    }}
                  >
                    {formik.errors.sendersMail}
                  </Typography>
                )}
                <input
                  type="email"
                  placeholder="Receiver's email"
                  name="receiversMail"
                  value={formik.values["receiversMail"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["receiversMail"] &&
                    Boolean(formik.errors["receiversMail"])
                  }
                  helperText={
                    formik.touched["receiversMail"] &&
                    formik.errors["receiversMail"]
                  }
                />
                {formik.touched.receiversMail &&
                  formik.errors.receiversMail && (
                    <Typography
                      variant="subtitle2"
                      color="error"
                      sx={{
                        marginTop: "-9px",
                        paddingLeft: "14px",
                        textAlign: "start",
                      }}
                    >
                      {formik.errors.receiversMail}
                    </Typography>
                  )}
                <Button
                  variant="contained"
                  sx={{ borderRadius: "2rem", height: "2.2rem", mt: 2 }}
                  type="button"
                  onClick={formik.handleSubmit}
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      {showFile && (
        <FileViewer
          open={showFile}
          handleClose={handleClose}
          fileUrl={fileData.fileUrl}
        />
      )}

      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        autoHideDuration={2000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={state.type === "success" ? "success" : ""}
          sx={{ bgcolor: "#323232", color: "var(--lightColor)" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
