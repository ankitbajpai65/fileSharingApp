"use client"
import { usePathname } from 'next/navigation';
import '../Home/Home.css';
import './Download.css';

const Download = () => {
    const pathname = usePathname();
    // const BASE_URL = 'http://localhost:5000';
    // const BASE_URL = "https://filesharingapp-backend.onrender.com";
    const BASE_URL = "https://file-sharing-app-backend-beryl.vercel.app";
    const file = pathname.split('/')[2];

    const handleDownloadBtn = async () => {
        try {
            const response = await fetch(`${BASE_URL}/download/${file}`);
            console.log(response);

            if (response.ok) {
                const filename = 'downloaded_file';
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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="homeContainer">
            <div className="homeBox downloadBox">
                <div className='imgContainer'>
                    <img src="/icon.png" alt="" />
                </div>
                <h2>Your file is ready to download</h2>
                {/* <small>Link will expire in 24 hrs</small> */}
                <p className='fileName'>{file}</p>
                <button
                    className='downloadBtn'
                    onClick={() => handleDownloadBtn()}
                >
                    Download File
                </button>
            </div>
        </section>
    )
}

export default Download;