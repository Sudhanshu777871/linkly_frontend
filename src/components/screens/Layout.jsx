import React, { useEffect } from 'react'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
    // code for useEffect
    useEffect(() => {
        const preventContextMenu = (event) => {
            event.preventDefault();
        };

        document.addEventListener('contextmenu', preventContextMenu);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
        };
    }, []);
    return (
        <>
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
