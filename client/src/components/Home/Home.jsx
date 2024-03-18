"use client";
import { useState, useRef, useContext } from 'react';
import Loader from './Loader';
import { Typography, Snackbar, Alert, Button, IconButton, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { useFormik } from 'formik';
import EmailSchema from './validationSchema';
import { AppContext } from '@/app/context/AppContext';
import './Home.css';

const BASE_URL = process.env.BASE_URL;

const Home = () => {
    const fileInputRef = useRef(null);
    const linkRef = useRef(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const [fileData, setFileData] = useState({
        fileLink: 'Generating link...',
        fileSize: ''
    });
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        type: ''
    });
    const { vertical, horizontal, open } = state;
    const { userData, isLoading } = useContext(AppContext);

    const handleAlertClose = () => {
        setState({
            ...state,
            open: false,
            type: ''
        });
    };

    const handleBrowseClick = async () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        try {
            if (selectedFile) {
                setUploadedFile(selectedFile);

                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('user', userData.id);

                const res = await fetch(`${BASE_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                    credentials: "include",
                });
                const data = await res.json();
                console.log(data)

                if (data.error === 'File size limit exceeded (max: 20MB)') {
                    setState((prev) => (
                        { ...prev, open: true, message: 'File is too large (max:20MB)', type: 'error' }
                    ));
                    setUploadedFile(null);
                }
                else {
                    setFileData({
                        fileLink: data.link,
                        fileSize: data.fileSize
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleCopyClick = () => {
        linkRef.current.select();

        try {
            navigator.clipboard.writeText(fileData.fileLink);
            setState((prev) => ({ ...prev, open: true, message: 'Link copied!', type: 'success' }));
        } catch (err) {
            console.error('Unable to copy link to clipboard');
        }
    };

    const handleSharing = async () => {
        try {
            await navigator.share({
                title: "Filegem",
                text: "Download url of a file",
                url: fileData.fileLink,
            });
            console.log("Data was shared successfully");
        } catch (err) {
            console.error("error:", err.message);
        }
    }

    const handleSendMail = async (values) => {
        setState((prev) => ({ ...prev, open: true, message: 'Email sent!', type: "success" }));
        try {
            const res = await fetch(`${BASE_URL}/sendMail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    toEmail: values.receiversMail,
                    fromEmail: values.sendersMail,
                    fileLink: fileData.fileLink,
                    fileSize: fileData.fileSize,
                    user: userData.name
                })
            });
            const data = res.json();
            console.log(data);
        } catch (error) {
            console.log(`Error sending email : ${error}`);
        }
    }

    const formik = useFormik({
        initialValues: {
            sendersMail: '',
            receiversMail: '',
        },
        validationSchema: EmailSchema,
        onSubmit: handleSendMail
    });

    return (
        <>
            {
                (isLoading) ? <Loader isLoading={isLoading} />
                    :
                    <section className="homeSection homeContainer">
                        <div className="homeBox">
                            <div className='imgContainer'>
                                <img src="/icon.png" alt="" />
                            </div>
                            <div>
                                <span>Drop your file here, or</span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <button className='browseBtn' onClick={handleBrowseClick}>
                                    Browse
                                </button>
                            </div>
                            {
                                uploadedFile &&
                                <div className='fileUploadedContainer'>
                                    <small>Link expires in 24 hrs</small>
                                    <div className="fileLinkDiv">
                                        <span className='fileLink'>{fileData.fileLink}</span>
                                        <input
                                            ref={linkRef}
                                            type="text"
                                            value={fileData.fileLink}
                                            readOnly
                                            style={{ display: 'none' }}
                                        />
                                        <Box sx={{ display: 'flex' }}>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={handleCopyClick}
                                                disabled={fileData.fileLink === 'Generating link...' && true}
                                                className="copyBtn"
                                            >
                                                <ContentCopyIcon sx={{ color: 'white' }} />
                                            </IconButton>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={handleSharing}
                                                disabled={fileData.fileLink === 'Generating link...' && true}
                                                className="shareBtn"
                                            >
                                                <ShareIcon sx={{ color: 'white' }} />
                                            </IconButton>
                                        </Box>
                                    </div>
                                    <p>Or send via Email</p>
                                    <form>
                                        <input
                                            type="email"
                                            placeholder="Your email"
                                            name="sendersMail"
                                            value={formik.values["sendersMail"]}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched["sendersMail"] && Boolean(formik.errors["sendersMail"])}
                                            helperText={formik.touched["sendersMail"] && formik.errors["sendersMail"]}
                                        />
                                        {formik.touched.sendersMail && formik.errors.sendersMail && (
                                            <Typography variant="subtitle2" color="error" sx={{
                                                marginTop: '-9px',
                                                paddingLeft: '14px',
                                                textAlign: 'start',
                                            }}>
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
                                            error={formik.touched["receiversMail"] && Boolean(formik.errors["receiversMail"])}
                                            helperText={formik.touched["receiversMail"] && formik.errors["receiversMail"]}
                                        />
                                        {formik.touched.receiversMail && formik.errors.receiversMail && (
                                            <Typography variant="subtitle2" color="error" sx={{
                                                marginTop: '-9px',
                                                paddingLeft: '14px',
                                                textAlign: 'start',
                                            }}>
                                                {formik.errors.receiversMail}
                                            </Typography>
                                        )}
                                        <Button
                                            variant="contained"
                                            sx={{ borderRadius: '2rem', height: '2.2rem', mt: 2 }}
                                            type="button"
                                            onClick={formik.handleSubmit}
                                        >
                                            Send
                                        </Button>
                                    </form>
                                </div>
                            }
                        </div>
                    </section>
            }

            <Snackbar
                open={open}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
                autoHideDuration={2000}
                onClose={handleAlertClose}>
                <Alert
                    onClose={handleAlertClose}
                    severity={state.type === 'success' ? "success" : "error"}
                    sx={{ bgcolor: '#323232', color: 'var(--lightColor)' }}
                >
                    {state.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Home;