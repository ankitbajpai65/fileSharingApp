"use client";
import { useState, useRef } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import './Home.css';

const Home = () => {
    const fileInputRef = useRef(null);
    const linkRef = useRef(null);
    const [uploadedFile, setUploadedFile] = useState({});
    const [fileLink, setFileLink] = useState('');

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
        // console.log(fileInputRef)
        fileInputRef.current.click();
    };

    const handleCopyClick = () => {
        linkRef.current.select();

        try {
            navigator.clipboard.writeText(fileLink);
            setState((prev) => ({ ...prev, open: true }));
        } catch (err) {
            console.error('Unable to copy link to clipboard');
        }
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // console.log('Selected File:', selectedFile);
            setUploadedFile(selectedFile)

            const formData = new FormData();
            formData.append('file', selectedFile);
            // console.log(formData);

            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            console.log(data);
            setFileLink(data.link)
        }
    };

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
                            <small>Link expires in 24 hrs</small>
                            <div className="fileLinkDiv">
                                <span className='fileLink'>{fileLink}</span>
                                <input
                                    ref={linkRef}
                                    type="text"
                                    value={fileLink}
                                    readOnly
                                    style={{ display: 'none' }}
                                />
                                <ContentCopyIcon className='copyIcon' onClick={handleCopyClick} />
                            </div>
                            <p>Or send via Email</p>
                            <form>
                                <input type="email" placeholder="Your email" />
                                <input type="email" placeholder="Receiver's email" />
                                <button>Send</button>
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
                    sx={{ bgcolor: '#323232', color: 'white' }}
                >
                    Link Copied!
                </Alert>
            </Snackbar>
        </>
    )
}

export default Home;