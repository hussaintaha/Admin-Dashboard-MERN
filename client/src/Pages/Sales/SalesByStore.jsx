import "../../css/salesByStore.css"
const process = import.meta.env
import React, { useEffect, useState } from 'react'
import getTheToken from "../../middleWare/getTokenFromStorage"

function SalesByStore() {

    const [stores, setStores] = useState([])
    const [salesArray, setSalesArray] = useState([])
    const [documentCount, setDocumentCount] = useState(0)
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [storeID, setStoreID] = useState();

    useEffect(() => {
        GetAllStoresName()
    }, [])

    async function getSaleByStore(index, storeID) {
        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/sales/historybystore`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    token: verifyObject.token
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ pageNo: index, storeID: storeID })
            })

            const data = await resp.json()
            setSalesArray(data.data.array)
            setDocumentCount(data.data.salesCount)
            setLoading(false)
            return
        }
        else {
            alert("notoken found")
        }
    }

    async function GetAllStoresName() {
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/sales/allstorename`, {
                headers: {
                    token: verifyObject.token
                }
            })
            const data = await resp.json()
            setStores(data.data)
        } else { alert("No token found") }
    }

    async function selectedStore(e) {
        // const storeNameSelected = useRef()
        if (e.target.selectedIndex > 0) {
            getSaleByStore(1, stores[e.target.selectedIndex - 1]._id)
            setStoreID(stores[e.target.selectedIndex - 1]._id)
        }
    }

    function previousPage() {
        
        if (pageCount > 1) {
            document.getElementById("next").disabled = false
            getSaleByStore(pageCount - 1, storeID)
            setPageCount(pageCount - 1)
        }
        else {
            document.getElementById("Previous").disabled = true
            setPageCount(pageCount)
        }
    }

    function nextPage(e) {
        if (pageCount < (documentCount / 10)) {
            getSaleByStore(pageCount + 1, storeID)
            document.getElementById("Previous").disabled = false
            setPageCount(pageCount + 1)
        }
        else {
            document.getElementById("next").disabled = true
            setPageCount(pageCount)
        }

    }

    return (
        <div className='performance_top_bar'>
            <div className='shop_options'>
                {stores.length > 0 ?
                    <div>
                        <select id="store" onChange={selectedStore}>
                            <option value={null} >Select Store</option>
                            {stores?.map((el, index) => {
                                return (<option key={index} value={el.store_name}>{el.store_name}</option>)
                            })}
                        </select>
                        {/* <h4>Store ID</h4> */}

                    </div>
                    : <h3>No Shop Availabel</h3>
                }
            </div>
            <div className='totoal_stores_tabel'>
                {loading ?
                    <h1>Loading......</h1>
                    :
                    <>
                        <h3>Total Sale Count <b>{documentCount}</b> </h3>
                        <table style={{ width: "100%", textAlign: "center" }}>
                            <thead >
                                <tr className='tabel_head_ul'>
                                    <th className='indexTD'>S.N</th>
                                    <th>DATE</th>
                                    <th>Order ID</th>
                                    <th>Customer Name</th>
                                    <th>Customer Email</th>
                                    <th>SALES</th>

                                </tr>
                            </thead>
                            {salesArray?.length <= 0 ?
                                <tbody>

                                    <tr className='noDataFound'>
                                        <td colSpan="6"> No Data To Show</td>
                                    </tr>
                                </tbody>
                                :
                                <tbody>
                                    {salesArray?.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="S.N" className='indexTD' >{((pageCount - 1) * 10) + index + 1}</td>
                                                <td data-label="ORDER DATE" >{(new Date(element?.order_date)).toLocaleDateString()}</td>
                                                <td data-label="Order ID" >{element?.transection_ID}</td>
                                                <td data-label="Customer Name" >{`${element?.user_first} ${element?.user_last}`}</td>
                                                <td data-label="Customer Email" >{element?.user_email}</td>
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
                    </>
                }
            </div>
        </div>
    )
}

export default SalesByStore
