import React from 'react'
const process =  import.meta.env
import { useNavigate } from 'react-router-dom'

function TopBar() {


    const navigate = useNavigate()

    function LogOut() {
        //write the logs out logic
        localStorage.removeItem("admin_login_token")
        sessionStorage.removeItem("admin_login_token")
        navigate("/login")
    }

    function openNav() {
        document.getElementById("sidebar_nav_toggle").style.display = "none";
        document.getElementById("mySidenav").style.padding = "0px 20px"
        window.innerWidth < 650 ?
            document.getElementById("mySidenav").style.width = "100%" :
            document.getElementById("mySidenav").style.width = "20%";
    }

    return (
        <div className="top_bar">
            <span id="sidebar_nav_toggle" onClick={openNav}>☰</span>
            <div className="welcome_message">
                <h3>Hello Admin, Welcome Back!</h3>
            </div>
            <div className="icon_area">
                <img className='profile_icon' src={`${process.VITE_BASE_URL}/media/images/icon.png`} />
                <button className="dd_button" onClick={LogOut}>Logout</button>
            </div>
        </div>
    )
}

export default TopBar
