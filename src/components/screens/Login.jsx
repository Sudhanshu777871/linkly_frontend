import React, { useState } from 'react'
import login from "../media/login.png"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from 'react-top-loading-bar'
function Login() {
    const navigate = useNavigate();

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


    // making usestate for getting the input data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [progress, setProgress] = useState(0)
    // code for making function to handel login
    const handelLoginFun = async (e) => {
        e.preventDefault();

        setProgress(20);
        // code for calling the API
        let callAPI = await fetch(import.meta.env.VITE_HANDEL_USER_LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: localStorage.getItem("token") })
        })
        // checking the result
        setProgress(50);
        if (callAPI) {
            setProgress(60);
            callAPI = await callAPI.json();
            setProgress(80);
            // checking the status
            if (callAPI.status === false) {
                setProgress(100);
                setEmail("")
                setPassword("")
                notify("Account Not Exits...")
                return false;
            }

            else {
                setEmail("");
                setPassword("");
                await localStorage.setItem("token", callApi.userToken);
                await localStorage.setItem("isLogged", email);
                setProgress(100);
                navigate("/");
            }
        }
    }

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
                    <form className='flex flex-col' onSubmit={handelLoginFun}>

                        <img src={login} alt="logo" className='h-28 w-28 object-contain self-center' />

                        <input type="email" name="email" id="email" placeholder='Email' autoComplete="off" className='w-full py-2 px-4 outline-none my-2' onChange={(e) => { setEmail(e.target.value) }} value={email} required />

                        <input type="password" name="password" id="password" placeholder='Password' autoComplete="off" className='w-full py-2 px-4 outline-none my-2'
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            onChange={(e) => { setPassword(e.target.value) }} value={password}
                            required />
                        {/* code for form submit */}
                        <input type="submit" value="Login" className='bg-orange-500 text-white px-5 py-1 text-lg rounded-sm my-3 w-1/2 hover:cursor-pointer  transition-all hover:ring-1 hover:ring-gray-200' />
                    </form>

                    <p className='text-white flex align-end items-center hover:cursor-pointer hover:text-orange-500 transition delay-75 ' onClick={() => { navigate("/signup") }}>Signup <i className='text-xl'>&#8594;</i></p>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Login
