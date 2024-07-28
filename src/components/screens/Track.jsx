import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import arrow from "../media/arrow.png"
import LoadingBar from 'react-top-loading-bar'
import DataChart from './DataChart';
import { useNavigate } from 'react-router-dom';

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
function Track() {
  const [urlId, setUrlId] = useState("");
  const [totalClicks, setTotalClicks] = useState(0);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractId, setExtractId] = useState("");

  // inheritace the navigate
  const navigate = useNavigate();
  // code for handling the url shortner function
  const handelUrlShortner = async () => {
    if (urlId === "") {
      notify("Please Enter Shorted URL...")
      return false;
    }
    else {
      const extractUrl = new URL(urlId).pathname.split("/");
      const mainExtractAns = extractUrl.pop();
      // code for checking the url is valid or not
      if (mainExtractAns === "") {
        notify("Invalid URL...");
      }
      else {
        // code for calling an api
        setProgress(20)
        let result = await fetch(import.meta.env.VITE_HANDEL_HISTORY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: mainExtractAns, email: localStorage.getItem("isLogged") })
        })
        setProgress(50)
        // checking result
        if (result) {
          result = await result.json();
          setProgress(70)
          // code for chekcing the reuslt is found or not
          if (result.status === false) {
            setProgress(100)
            notify("URL Is Not Opened Yet...")
            return false;
          }
          else if (result.status === 2) {
            setProgress(100);
            notify("Unauthorized URL Tracking...")
            return false;
          }
          else {
            console.log(result)
            setProgress(80)
            setTotalClicks(result.length)
            setProgress(90)
            setData(result);
            setProgress(100)
            setStatus(true)
            setExtractId(mainExtractAns);
          }
        } else {
          notify("Some Error Occured, Please Try Again...")
          return false;
        }
      }
    }
  }

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

  // code for useEffect
  useEffect(() => {
    const auth = localStorage.getItem("isLogged");
    const token = localStorage.getItem("token");
    if (!auth || !token) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <div className="h-[100%] md:h-lvh w-full bg-gradient-to-br from-[rgb(12,31,39)] to-[rgb(10,15,24)] font-sans pt-3">
        <LoadingBar
          color='rgb(249,115,22)'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        <div className="flex mx-5 justify-between items-center bg-[rgb(24,30,41)] px-3 py-2 border-4 border-[rgb(50,62,89)] rounded-full sm:w-3/4 sm:m-auto xl:py-1">
          <i className="fa fa-link text-xl text-white font-light"></i>
          <input type="url" title='Please Enter Valid URL' name="url" id="url" autoComplete='off' placeholder='Enter Shorted URL For Tracking . . .' className=' p-2 w-2/3 bg-[rgb(24,30,41)] outline-none text-white md:placeholder:text-2xl md:text-2xl md:-ml-12 lg:-ml-48 xl:-ml-60 xl:p-1 xl:placeholder:text-xl xl:text-xl' value={urlId} onChange={(e) => { setUrlId(e.target.value) }} />
          <button className='p-2 text-2xl bg-blue-600 rounded-full hover:ring ring-white transition-all' onClick={handelUrlShortner}><img src={arrow} alt="go" className='h-7 w-7' /> </button>
        </div>
        {/* code for showing the result */}
        {status && <div className="flex flex-wrap md:flex-nowrap w-[90%] m-auto my-11">
          <div className='flex flex-col w-full md:w-1/2 h-96 p-3 overflow-hidden overflow-y-scroll shadow-sm shadow-gray-300 border-gray-300 border-t-2'>
            <h2 className='text-orange-500 text-xl font-semibold px-4 my-4'>Total Clicks : {totalClicks}</h2>

            <table className='table-auto border-separate border-2 border-slate-500'>
              <caption className="caption-top mb-3 font-semibold text-white">
                Click History
              </caption>
              <tr>
                <th className='border border-slate-700 bg-slate-700 text-white py-2'>
                  S.No
                </th>
                <th className='border border-slate-700 bg-slate-700 text-white py-2'>Date & Time</th>
              </tr>
              {data.map((data, index) => (
                <tr key={index}>
                  <td className='border border-slate-600 bg-slate-600 py-1 text-center text-white'>{index + 1}</td>
                  <td className='
            border border-slate-600 bg-slate-600 py-1 text-center text-white'>{handelDateTime(data.Date)}</td>
                </tr>
              ))}
            </table>
          </div>
          {/* code for showing number of clicks in graph */}
          <DataChart urlId={extractId} />
        </div>}
      </div>
      <ToastContainer />
    </>
  )
}

export default Track
