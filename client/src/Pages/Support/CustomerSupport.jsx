import React, { useState, useEffect } from 'react'
import "../../css/customer_support.css"
const process = import.meta.env
import getTheToken from "../../middleWare/getTokenFromStorage";

function CustomerSupport() {

  const [detailsArray, setDetailsArray] = useState({})
  const [loading, setLoading] = useState({ form: false, details: true })

  const phone_number = React.useRef();
  const email = React.useRef()
  const social_handel = React.useRef()


  async function UpdateTheContactInfo(e) {

    e.preventDefault();
    const verifyObject = getTheToken()
    if (verifyObject.available) {
      const data = await fetch(`${process.VITE_BASE_URL}/support/contactinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: verifyObject.token
        },
        body: JSON.stringify({
          phone_number: phone_number.current.value,
          email_address: email.current.value,
          social_handal: social_handel.current.value
        })
      })

      const resp = await data.json()
      phone_number.current.value = ""
      email.current.value = ""
      social_handel.current.value = ""
      console.log("resp from server ", resp)
      getTheContact()
      return
    }
    else {
      alert("no access token")
    }
  }


  async function getTheContact() {
    const verifyObject = getTheToken()
    if (verifyObject.available) {
      const data = await fetch(`${process.VITE_BASE_URL}//support/contactinfo`, { headers: { token: verifyObject.token } })
      const resp = await data.json()
      console.log("contact info ", resp);
      Object.keys(resp.data).length > 0 ? setLoading({ ...loading, details: false }) : ({ ...loading, details: true })
      setDetailsArray(resp.data)
      Object.keys(resp.data).length > 0 ? console.log("resp length is true ", Object.keys(resp.data).length) : console.log("resp length  is false ", Object.keys(resp.data).length)
    }
  }

  useEffect(() => { getTheContact() }, [])


  return (
    <div className='contact_parent'>
      <h1>Customer Support</h1>
      <div className='contact_container'>
        <div className='contact_form'>
          {/* <h3>Update new contact details</h3> */}
          <form className="" onSubmit={UpdateTheContactInfo}>
            {loading?.form ?
              <h2>Loading....</h2>
              :
              <>
                <label>Phone Number</label>
                <input className="linkInput" ref={phone_number} type="tel" id="phone" name="phone" placeholder="Phone Number Here" pattern="[0-9]{10}" required />
                <label>Email Address</label>
                <input className="linkInput" ref={email} type="email" name="email_address" placeholder="Email Address" required />
                <label>Facbook Page Handle</label>
                <input className="linkInput" ref={social_handel} type="text" name="social_handal" placeholder="Facbook page handel" required />
                <div className='submitBTN'>

                  <input className="btnInput" type="submit" value="Submit" />
                </div>
              </>
            }
          </form>
        </div>
        <div className='contact_info_now'>
          {loading?.details ?
            <h2>No Data To Show</h2>
            : <>
              <h2>Contact Details Now</h2>
              <div className='contact_info_detail'>
                <h5>Phone Number</h5>
                <h3>{detailsArray?.phone_number}</h3>
                <h5>Email Address</h5>
                <h3>{detailsArray?.email_address}</h3>
                <h3><a href={detailsArray?.support_handal}>Goto Support Page</a></h3>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default CustomerSupport
