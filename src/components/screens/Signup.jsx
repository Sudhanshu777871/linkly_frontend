import React, { useState, useEffect } from 'react'
import account from "../media/account.png"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from 'react-top-loading-bar'
function Signup() {
    const navigate = useNavigate();
    // code for notify
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

    // making state for getting the user input value
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [progress, setProgress] = useState(0)
    // code for making function to handel signup form
    const handelSignupAction = async (e) => {
        e.preventDefault();
        setProgress(30)
        let callApi = await fetch(import.meta.env.VITE_HANDEL_USER_SIGNUP, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })
        setProgress(70);
        // chekcing the data
        if (callApi) {
            callApi = await callApi.json();
            console.log(callApi.userToken)
            setProgress(90)
            // code for checking the user result
            if (callApi.status === false) {
                setProgress(100);
                notify("Account Already Exits, Please login . . .")
                return false;
            } else {
                setProgress(100)
                await localStorage.setItem("token", callApi.userToken)
                await localStorage.setItem("isLogged", email);
                navigate("/");
            }
        }
    }
    // code for calling the useEffect
    useEffect(() => {
        const userToken = localStorage.getItem("token");
        const userEmail = localStorage.getItem("userEmail");
        if (userToken && userEmail) {
            navigate("/")
        }
    }, []);
    return (
        <>
            <div className={`h-lvh w-full font-sans flex justify-center
             items-center addBgImg`}>
                <LoadingBar
                    color='rgb(249,115,22)'
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                />
                {/* code for main content */}
                <div className='w-3/4 sm:h-3/5 md:w-2/5 xl:w-1/4 m-auto'>
                    <form className='flex flex-col' onSubmit={handelSignupAction}>

                        <img src={account} alt="logo" className='h-28 w-28 object-contain self-center' />
                        <input type="text" name="name" id="name" placeholder='Name' autoComplete="off" className='w-full py-2 px-4 outline-none my-2' required={true} value={name} onChange={(e) => { setName(e.target.value) }} />

                        <input type="email" name="email" id="email" placeholder='Email' autoComplete="off" className='w-full py-2 px-4 outline-none my-2' required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />

                        <input type="password" name="password" id="password" placeholder='Password' autoComplete="off" className='w-full py-2 px-4 outline-none my-2'
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            required={true} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        {/* code for form submit */}
                        <input type="submit" value="Signup" className='bg-orange-500 text-white px-5 py-1 text-lg rounded-sm my-3 w-1/2 hover:cursor-pointer  transition-all hover:ring-1 hover:ring-gray-200' />
                    </form>

                    <p className='text-white flex align-end items-center hover:cursor-pointer hover:text-orange-500 transition delay-75 ' onClick={() => { navigate('/login') }}>Login <i className='text-xl'>&#8594;</i></p>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Signup
