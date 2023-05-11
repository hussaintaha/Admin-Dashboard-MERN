import "../../css/table.css"
import React, { useEffect, useState } from 'react'
import getTheToken from "../../middleWare/getTokenFromStorage";
const process =  import.meta.env

function Custmer() {

    // const apiKey = process.env.REACT_APP_BASE_URL 
    
    const [customer, setCustomer] = useState([])
    const [loading, setLoading] = useState(false);
    const [documentCount, setDocumentCount] = useState()
    const [pageCount, setPageCount] = useState(1);

    async function getCustomer(pageNo) {
        setLoading(true)

        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/customer/${pageNo}`,
                {
                    headers: {
                        token: verifyObject.token
                    }
                }
            )
            const data = await resp.json();
            setCustomer(data.data.array)
            setDocumentCount(data.data.customerCount)
            setLoading(false)
            return
        } else {
            alert("No Token Found")
        }
    }

    function previousPage() {
        setPageCount((p) => {
            if (p > 1) {
                document.getElementById("next").disabled = false
                getCustomer(p - 1)
                return p - 1
            }
            else {
                document.getElementById("Previous").disabled = true
            }
            return p
        })
    }

    function nextPage() {
        setPageCount((p) => {
            if (p < (documentCount / 10)) {
                document.getElementById("Previous").disabled = false
                getCustomer(p + 1)
                return p + 1
            }
            else {
                document.getElementById("next").disabled = true
            }
            return p
        })
    }

    async function handleDownload(e) {
        e.preventDefault()
        const link = document.getElementById("download")
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            try {
                link.setAttribute("href", `${process.VITE_BASE_URL}/private/excel`)
                link.click()
            } catch (err) { console.log("error from the download link", err) }
        } else {
            alert("No Token Found")
        }
    }

    useEffect(() => { getCustomer(pageCount) }, [])
    return (
        <div className='totoal_stores_tabel'>
            {loading ?
                <h1>Loading......</h1>
                :
                <div>
                    <div className='customer_header'>
                        <h2 className='caption'> Total Customer :<span> {documentCount}</span></h2>
                        <button onClick={handleDownload}> Download</button>
                    </div>
                    <table style={{ width: "100%", textAlign: "center" }}>

                        <thead >
                            <tr className='tabel_head_ul'>
                                <th className='indexTD'>S.N</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email ID</th>
                                <th>Total Orders</th>
                                <th>Total Sales</th>
                            </tr>
                        </thead>
                        {customer?.length <= 0 ?
                            <tbody>

                                <tr className='noDataFound'>
                                    <td colSpan="7"> No Data To Show</td>
                                </tr>
                            </tbody>
                            :
                            <tbody>
                                {customer?.map((element, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label="S.N" className='indexTD' >{((pageCount - 1) * 10) + index + 1}</td>
                                            <td data-label="First Name" className='firstName'>{element?.user_first_name}</td>
                                            <td data-label="Last Name" className='lastName'>{element?.user_last_name}</td>
                                            <td data-label="Email ID" >{element?.user_email}</td>
                                            <td data-label="Total Orders" > {element?.totalOrder}</td>
                                            <td data-label="Total Sales" >$ {(element?.total)?.toLocaleString()}</td>
                                        </tr>

                                    )
                                })}
                            </tbody>
                        }
                    </table>
                    <div className='paginationBtn'>
                        <div className='pagination_btn'>
                            <button id='Previous' onClick={previousPage}>Previous</button>
                            <button id="next" onClick={nextPage}>Next</button>
                        </div>
                    </div>
                </div>

            }
            <a href='' id='download'></a>

        </div>
    )
}

export default Custmer
