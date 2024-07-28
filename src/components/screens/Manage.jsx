import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QRCanvas } from 'qrcanvas-react';
function Manage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [domainName, setDomainName] = useState('');

    const [qrProperty, setQrProperty] = useState({
        cellSize: 8,
        data: null,
    });
    const canvasRef = useRef(null);

    // code for notify
    // ERROR
    const notify = (msg) =>
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

    const errNotify = (msg) =>
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
    // making function for logout
    const handelLogout = () => {
        localStorage.clear();
        navigate('/login');
    }
    // code for making api to call the user created url
    const handelUserURL = async () => {
        let result = await fetch(import.meta.env.VITE_HANDEL_USER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: localStorage.getItem("isLogged") })
        })

        // checking data
        if (result) {
            result = await result.json();
            // storing data into value
            setDomainName(result.url)
            setData(result.data);
        }
    }

    // code for making date time in user readable formate
    // fuction for coverting the dateTime in to normal date time
    function handelDateTime(dateString) {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDateTime;

    }



    // function for copying the text

    // code for making function to handel copy url
    const handelCopyURL = (val) => {
        // Create a textarea element to hold the text temporarily
        const textarea = document.createElement('textarea');
        textarea.value = val;

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
            notify("URL  Copied...")
        }

        // Remove the textarea from the DOM
        document.body.removeChild(textarea);
    };

    // code for making function to delete the link
    const handelDeleteFun = async (id) => {
        const confirm = window.confirm("Are You Sure Want To Delete ?");
        if (confirm) {
            let result = await fetch(import.meta.env.VITE_HANDEL_USER_DELETE, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })

            // code for chekcing the result
            if (result) {
                result = await result.json();
                // chekcing 
                if (result === true) {
                    handelUserURL();
                } else {
                    errNotify("Server Problem Occured, Try Later...");
                    return false;
                }
            }
        }
        else {
            return false;

        }
    }

    // making function for generating the qr code

    const downloadQRCode = (url) => {
        setQrProperty({
            cellSize: 8,
            data: url,
        })



        const canvas = document.querySelector('.qr-canvas canvas');
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // code for calling the useeffect
    useEffect(() => {
        const auth = localStorage.getItem("isLogged");
        const token = localStorage.getItem("token");
        if (!auth || !token) {
            navigate("/login");
        }
        else {
            handelUserURL();
        }
    }, []);
    return (
        <>
            <div className={`h-lvh w-full font-sans flex flex-col lg:justify-between md:justify-between bg-gradient-to-br from-[rgb(12,31,39)] to-[rgb(10,15,24)]`}>
                {/* code for navbar */}
                <nav className='flex justify-between items-center py-3 border-b-[1px] border-b-gray-500'>
                    <h1 className='text-3xl text-orange-500 mx-5 font-extrabold'>Linkly</h1>
                    <div>

                        <button className={`px-5 py-1.5 bg-[rgb(24,30,41)] border-2 border-white shadow-sm  text-2xl mx-0 rounded-sm   text-white hover:bg-white hover:text-black`} onClick={() => { navigate("/track") }}>Track URL</button>


                        <button className={`px-5 py-1.5 bg-orange-700 border-2 border-orange-700 shadow-sm  text-2xl rounded-sm mx-2 hover:ring`} title='Logout' onClick={handelLogout}>  <i className="fa fa-sign-out text-white" ></i></button>
                    </div>
                </nav>
                {/* div for downloading the qr code */}
                <div className='w-16 h-16 hidden qr-canvas'>
                    <QRCanvas options={qrProperty} ref={canvasRef} />
                </div>
                {/* code for main content here */}
                <div className="flex flex-col w-full lg:w-3/4 m-auto h-96 p-3 overflow-hidden overflow-y-scroll">
                    {data.length > 0 ?

                        <table className='table-auto border-separate border-2 border-slate-500'>
                            <caption className="caption-top mb-3 font-semibold text-white">
                                Your URL's
                            </caption>
                            <tr>
                                <th className='border border-slate-700 bg-slate-700 text-white py-2'>
                                    URL
                                </th>
                                <th className='border border-slate-700 bg-slate-700 text-white py-2'>Action</th>
                            </tr>
                            {data.map((data, index) => (

                                <tr key={index}>
                                    <td className='border border-slate-600 bg-slate-600 py-1 px-2 text-white'><p className='text-[0.9rem]'>{`${domainName}/${data.Short_Url}`}</p><p className='text-[0.7rem]'><span className='text-orange-400'> Created </span>: {handelDateTime(data.Created_Date)}</p></td>
                                    <td className='
                border border-slate-600 bg-slate-600 py-1 text-center text-white'>
                                        <i className="fa fa-copy hover:cursor-pointer text-white bg-blue-800 p-2 rounded-xl font-light hover:ring mx-1" onClick={() => { handelCopyURL(`${domainName}/${data.Short_Url}`) }} title='Copy'></i>

                                        <i className="fa fa-qrcode hover:cursor-pointer text-white bg-blue-800 p-2 rounded-xl font-light hover:ring mx-1" onClick={() => { downloadQRCode(`${domainName}/${data.Short_Url}`) }} title='QR Code'></i>

                                        <i className="fa fa-trash-o hover:cursor-pointer text-white bg-red-700 p-2 rounded-xl font-light hover:ring mx-1" title='Delete' onClick={() => { handelDeleteFun(data.Short_Url) }}></i> </td>
                                </tr>

                            ))}
                        </table> : <h1 className='text-white text-3xl'>No URL Is Cretaed Yet <span className='text-red-700 font-bold'>:(</span></h1>
                    }
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Manage
