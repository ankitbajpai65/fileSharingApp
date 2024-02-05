"use client";
import { useState, useRef } from 'react';
import { Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import config from '../../../next.config';
import { useFormik } from 'formik';
import EmailSchema from './validationSchema';
import { Typography } from '@mui/material';
import './Home.css';

const BASE_URL = config.env.BASE_URL;

const Home = () => {
    const fileInputRef = useRef(null);
    const linkRef = useRef(null);
    const [uploadedFile, setUploadedFile] = useState({});
    // const [formInputs, setFormInputs] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const [fileData, setFileData] = useState({
        fileLink: 'Generating link...',
        fileSize: ''
    });
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleAlertClose = () => {
        setState({
            ...state,
            open: false,
        });
    };

    const handleBrowseClick = async () => {
        fileInputRef.current.click();
    };

    const handleCopyClick = () => {
        linkRef.current.select();

        try {
            navigator.clipboard.writeText(fileData.fileLink);
            setState((prev) => ({ ...prev, open: true, message: 'Link copied!' }));
        } catch (err) {
            console.error('Unable to copy link to clipboard');
        }
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setUploadedFile(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);
            // console.log(formData);

            const res = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            // console.log(data);
            setFileData({
                fileLink: data.link,
                fileSize: data.fileSize
            })
        }
    };

    const handleSendMail = async (values) => {
        setState((prev) => ({ ...prev, open: true, message: 'Email sent!' }));
        try {
            const res = await fetch(`${BASE_URL}/sendMail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toEmail: values.receiversMail,
                    fromEmail: values.sendersMail,
                    fileLink: fileData.fileLink,
                    fileSize: fileData.fileSize
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
            <section className="homeContainer">
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
                        fileInputRef.current &&
                        <div className='fileUploadedContainer'>
                            {/* <small>Link expires in 24 hrs</small> */}
                            <div className="fileLinkDiv">
                                <span className='fileLink'>{fileData.fileLink}</span>
                                <input
                                    ref={linkRef}
                                    type="text"
                                    value={fileData.fileLink}
                                    readOnly
                                    style={{ display: 'none' }}
                                />
                                <ContentCopyIcon className='copyIcon' onClick={handleCopyClick} disabled={fileData.fileLink === 'Generating link...' && true} />
                            </div>
                            <p>Or send via Email</p>
                            <form type="button">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    name="sendersMail"
                                    // value={formInputs.sendersMail}
                                    // onChange={(e) => setFormInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
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
                                    // value={formInputs.receiversMail}
                                    // onChange={(e) => setFormInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
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
                                <button type="button" onClick={formik.handleSubmit}>Send</button>
                            </form>
                        </div>
                    }
                </div>
            </section>

            <Snackbar
                open={open}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
                autoHideDuration={2000}
                onClose={handleAlertClose}>
                <Alert
                    onClose={handleAlertClose}
                    severity="success"
                    sx={{ bgcolor: '#323232', color: 'var(--lightColor)' }}
                >
                    {state.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Home;