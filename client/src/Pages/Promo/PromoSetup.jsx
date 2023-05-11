import React from 'react'
import "../../css/promosetup.css"
import getTheToken from "../../middleWare/getTokenFromStorage";
const process = import.meta.env


function PromoSetup() {

    const input = React.useRef();

    async function addTheNewLink(e) {
        e.preventDefault()
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            console.log("its addTheNewLink")
            const data = await fetch(`${process.VITE_BASE_URL}//promo/link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: verifyObject.token
                },
                body: JSON.stringify({ videoLink: input.current.value })
            })
            const resp = await data.json()
            console.log("resp ", resp)
        }
        else {
            alert("No token found")
        }

    }

    return (
        <div className="main-content">
            <form className="promo_form" onSubmit={addTheNewLink}>
                <input className="linkInput" type="text" name="name" autoComplete='off' ref={input} placeholder="Paste the link here!" />
                <input className="btnInput " type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default PromoSetup
