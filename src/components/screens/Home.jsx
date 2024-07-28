import React, { useState, useRef } from 'react'
import "../css/main.css"
import arrow from "../media/arrow.png"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from 'react-top-loading-bar'
import { QRCanvas } from 'qrcanvas-react';

// code for notify
// ERROR
const notify = (msg) =>
    toast.error(msg, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
// SUCCESS
const successNotify = (msg) =>
    toast.success(msg, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
function Home() {
    const [shortUrlData, setShortUrlData] = useState("");
    const [urlStatus, setUrlStatus] = useState(false);
    const navigate = useNavigate();
    const [urlId, setUrlId] = useState("");
    const [progress, setProgress] = useState(0)
    const [qrProperty, setQrProperty] = useState({
        cellSize: 8,
        data: null,
    });
    const canvasRef = useRef(null);
    const [isDark, setIsDark] = useState(false);
    // code for handling the url shortner function
    const handelUrlShortner = async () => {

        if (urlId === "") {
            notify("Please Enter URL...")
            return false;
        }
        else {

            if (localStorage.getItem("isLogged") && localStorage.getItem("token")) {
                const urlPattern = /^(ftp|http|https):\/\/[^ "]+(\.[^ "]+)+$/;

                if (urlPattern.test(urlId)) {
                    setProgress(30)
                    // code for calling an api
                    let result = await fetch(import.meta.env.VITE_NEW_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ originalURL: urlId, email: localStorage.getItem("isLogged") })
                    })
                    // checking result
                    if (result) {
                        setProgress(50)
                        result = await result.json();
                        setProgress(70)
                        setShortUrlData(result.result)
                        setQrProperty({
                            cellSize: 8,
                            data: result.result,
                        })
                        setProgress(100)
                        setUrlStatus(true);
                    } else {
                        notify("Some Error Occured, Please Try Again...")
                        return false;
                    }

                } else {
                    notify("Please Enter Valid URL...")
                    return false;
                }

            }
            else {
                navigate("/login");
                return false;
            }
        }

    }
    // code for making function to handel copy url
    const handelCopyURL = () => {
        // Get the content of the <p> tag
        const textToCopy = document.querySelector('.shortURLPara').textContent;

        // Create a textarea element to hold the text temporarily
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;

        // Make the textarea invisible
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;

        // Append the textarea to the DOM
        document.body.appendChild(textarea);

        // Select the text within the textarea
        textarea.select();

        try {
            // Execute the copy command
            document.execCommand('copy');
            successNotify("URL Copied...")

        } catch (err) {
            notify("URL Not Copied...")
        }

        // Remove the textarea from the DOM
        document.body.removeChild(textarea);
    };

    // code for download the qr code 

    const downloadQRCode = () => {
        const canvas = document.querySelector('.qr-canvas canvas');
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // code for making function to handel modes
    const mode = () => {
        setIsDark(!isDark)
    }

    return (
        <>
            <div className={`h-lvh w-full ${isDark ? `bg-white` : `bg-gradient-to-br from-[rgb(12,31,39)] to-[rgb(10,15,24)]`}  font-sans flex flex-col lg:justify-between md:justify-between`}>
                <LoadingBar
                    color='rgb(249,115,22)'
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                />
                {/* code for navbar */}
                <nav className='flex justify-between items-center py-3'>
                    <h1 className='text-3xl text-orange-500 mx-5 font-extrabold'>Linkly</h1>
                    <div>
                        {(localStorage.getItem("isLogged") && localStorage.getItem("token")) && <button className={`px-5 py-1.5  shadow-sm shadow-gray-400 text-2xl mx-1 rounded-full border-2 border-gray-400 hover:ring ${!isDark ? `text-[rgb(24,30,41)] bg-white` : ` text-white bg-[rgb(24,30,41)]`}`} onClick={() => { navigate("/manage") }}> <i className={`fa fa-user`}></i></button>}


                        <button className={`px-5 py-1.5 ${isDark ? `bg-white` : `bg-[rgb(24,30,41)]`} ${isDark ? `text-[rgb(24,30,41)]` : `text-white`}   shadow-sm shadow-gray-400 text-2xl mx-5 rounded-full border-2 border-gray-400 hover:ring`} onClick={mode}> {isDark ? <p><i className
                            ={`fa fa-moon-o ${isDark ? `text-[rgb(24,30,41)]` : `text-white`} text-2xl mx-1`}></i></p> : <p><i className
                                ={`fa fa-sun-o ${isDark ? `text-[rgb(24,30,41)]` : `text-white`} text-2xl mx-1`}></i></p>}</button>
                    </div>

                </nav>
                <div className='w-16 h-16 hidden qr-canvas'>
                    <QRCanvas options={qrProperty} ref={canvasRef} />
                </div>


                {/* code for mai title */}
                <div>
                    <div className="flex mt-16 mb-8 flex-col mx-4 ">
                        <h1 className='font-extrabold text-center antialiased leading-[45px] text-5xl lg:text-6xl textStyle'>Shorten Your Loooong Links :)</h1>
                        <p className={`text-center ${isDark ? `text-black` : `text-white`}  mt-4 text-lg sm:text-2xl`}>Linky Is an efficient and easy-to-use URL shortening service that streamlines your online experience</p>
                    </div>

                    {/* code for input */}
                    <div className={`flex mx-5 justify-between items-center ${isDark ? `bg-white` : `bg-[rgb(24,30,41)]`}  px-3 py-2 border-4 border-[rgb(50,62,89)] rounded-full sm:w-3/4 sm:m-auto xl:py-1`}>
                        <i className={`fa fa-link text-3xl ${isDark ? `text-[rgb(24,30,41)]` : `text-white`}  font-light `}></i>
                        <input type="url" title='Please Enter Valid URL' name="url" id="url" autoComplete='off' placeholder='Enter URL Here . . .' className={`p-3 w-2/3 ${isDark ? `bg-white` : `bg-[rgb(24,30,41)]`}  outline-none ${isDark ? `text-[rgb(24,30,41)]` : `text-white`} md:placeholder:text-2xl md:text-2xl md:-ml-12 lg:-ml-48 xl:-ml-60 xl:p-1 xl:placeholder:text-xl xl:text-xl`} value={urlId} onChange={(e) => { setUrlId(e.target.value) }} />
                        <button className='p-3 text-3xl bg-blue-600 rounded-full hover:ring ring-white transition-all' onClick={handelUrlShortner}><img src={arrow} alt="go" className='h-7 w-7' /> </button>
                    </div>
                    {/* code for adding the button to track url */}
                    <div className='flex justify-center'>
                        <button className={`${isDark ? `bg-white border-2 border-[rgb(50,62,89)] text-[rgb(50,62,89)]` : `bg-[rgb(50,62,89)] border-2 border-[rgb(50,62,89)] text-white`} mx-2 mt-3  px-4 py-2 text-xl rounded-sm hover:ring`} onClick={() => navigate("/track")}> Track Link </button>

                        {urlStatus && <button className={`${isDark ? `bg-white border-2 border-[rgb(50,62,89)] text-[rgb(50,62,89)]` : `bg-[rgb(50,62,89)] border-2 border-[rgb(50,62,89)] text-white`} mx-2 mt-3 px-4 py-2 text-xl rounded-sm hover:ring`} onClick={downloadQRCode}> Generate QR </button>}
                    </div>
                    {/* code for making shorten url  */}
                    {urlStatus &&
                        <div className={`flex max-w-fit m-auto ${isDark ? `bg-white border-2 border-[rgb(50,62,89)] text-[rgb(50,62,89)]` : `bg-[rgb(50,62,89)] border-2 border-[rgb(50,62,89)] text-white`} p-2 my-5 justify-around items-center shadow-sm shadow-gray-300`}>
                            <p className={` ${isDark ? `text-[rgb(50,62,89)]` : `text-white`} text-md shortURLPara`}>{shortUrlData}</p>
                            <button className='bg-blue-500 px-3 py-1 text-white font-semibold rounded-sm mx-5 items-center' onClick={handelCopyURL}>Copy</button>
                        </div>
                    }

                </div>

                <div></div>
                <div></div>
            </div>

            <ToastContainer />
        </>
    )
}

export default Home
