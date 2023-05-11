import React, { useState, useEffect } from 'react'
import "../../css/table.css"
const process = import.meta.env
import getTheToken from "../../middleWare/getTokenFromStorage"

function SalesHistory() {

    const [storesArray, setStoresArray] = useState([])
    const [loading, setLoading] = useState(false)
    const [documentCount, setDocumentCount] = useState()
    const [pageCount, setPageCount] = useState(1);

    async function getSaleHistory(pageNo) {
        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/sales/history/all/${pageNo}`, {
                headers: {
                    token: verifyObject.token
                }
            })
            const data = await resp.json();
            setStoresArray(data.data.array)
            setDocumentCount(data.data.saleHistoryCount)
            setLoading(false)
        } else { alert("No token found") }
    }

    function previousPage() {
        setPageCount((p) => {

            if (p > 1) {
                document.getElementById("next").disabled = false
                getSaleHistory(p - 1)
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
                getSaleHistory(p + 1)
                return p + 1
            }

            else {
                document.getElementById("next").disabled = true
            }
            return p
        })

    }

    useEffect(() => { getSaleHistory(1) }, [])


    return (
        <div className='totoal_stores_tabel'>
            {loading ?
                <h1>Loading......</h1>
                :
                <div>
                    <h3>Total Sales History <b>{documentCount}</b> </h3>
                    <table style={{ width: "100%", textAlign: "center" }}>
                        <thead >
                            <tr className='tabel_head_ul'>
                                <th className='indexTD'>S.N</th>
                                <th>DATE</th>
                                <th>Customer Name</th>
                                <th>Customer Email</th>
                                <th>STORE ID</th>
                                <th>STORE URL</th>
                                <th>SALES ID</th>
                                <th>SALES</th>

                            </tr>
                        </thead>
                        {storesArray?.length <= 0 ?
                            <tbody>

                                <tr className='noDataFound'>
                                    <td colSpan="8"> No Data To Show.....</td>
                                </tr>
                            </tbody>
                            :
                            <tbody>
                                {storesArray?.map((element, index) => {
                                    return (
                                        <tr key={element?.index}>
                                            <td data-label="S.N" className='indexTD'>{((pageCount - 1) * 10) + index + 1}</td>
                                            <td data-label="ORDER DATE" >{(new Date(element?.order_date)).toLocaleDateString()}</td>
                                            <td data-label="Customer Name" >{element?.user_first + " " + element?.user_last}</td>
                                            <td data-label="Customer Email" >{element?.user_email}</td>
                                            <td data-label="STORE ID" >{element?.store_ID}</td>
                                            <td data-label="STORE URL" >{element?.store_name}</td>
                                            <td data-label="SALES ID" >{element?.transection_ID}</td>
                                            <td data-label="SALES Amount" >$ {((element?.transection_amount).toFixed(2))?.toLocaleString()}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>}
                    </table>
                    <div className='paginationBtn'>
                        <div className='pagination_btn'>
                            <button id='Previous' onClick={previousPage}>Previous</button>
                            <button id="next" onClick={nextPage}>Next</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default SalesHistory
