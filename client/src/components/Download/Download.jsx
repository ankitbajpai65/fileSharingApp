"use client"
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import config from '../../../next.config';
import '../Home/Home.css';
import './Download.css';

const BASE_URL = config.env.BASE_URL;

const Download = () => {
    const pathname = usePathname();
    const [isDownloadBtnClicked, setIsDownloadBtnClicked] = useState(false);
    const file = pathname.split('/')[2];

    const handleDownloadBtn = async () => {
        setIsDownloadBtnClicked(true);
        try {
            const response = await fetch(`${BASE_URL}/download/${file}`);

            if (response.ok) {
                const filename = 'filegem';
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error(`Failed to download file. Status: ${response.status}`);
            }
            setTimeout(() => setIsDownloadBtnClicked(false), 3000);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="downloadSection">
            <div className="homeBox downloadBox">
                <div className='imgContainer'>
                    <img src="/icon.png" alt="" />
                </div>
                <h2>Your file is ready to download</h2>
                {/* <small>Link will expire in 24 hrs</small> */}
                <p className='fileName'>{file}</p>
                <button
                    className='downloadBtn'
                    disabled={isDownloadBtnClicked ? true : false}
                    onClick={() => handleDownloadBtn()}
                >
                    {isDownloadBtnClicked ? "Downloading..." : "Download File"}
                </button>
            </div>
        </section>
    )
}

export default Download;