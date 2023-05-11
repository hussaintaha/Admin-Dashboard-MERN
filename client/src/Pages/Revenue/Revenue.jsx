import React, { useEffect, useState } from 'react'
import "../../css/table.css"
const process = import.meta.env
import getTheToken from "../../middleWare/getTokenFromStorage"
function Revenue() {

    const [storesArray, setStoresArray] = useState([])
    const [loading, setLoading] = useState(false)
    const [documentCount, setDocumentCount] = useState()
    const [pageCount, setPageCount] = useState(1);


    async function getAllShops(pageNo) {
        console.log("getAllShops getting called for Page No ", pageNo)
        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/stores/totalStores/${pageNo}`,{
                headers:{token:verifyObject.token}
            })
            const data = await resp.json();
            console.log(data.data)
            GetStoreSale(data.data.array)
            setDocumentCount(data.data.dataCount)
        }else{
            alert("No token found")
        }
    }

    function previousPage() {
        console.log("pageCount   ", pageCount)
        setPageCount((p) => {

            if (p > 1) {
                document.getElementById("next").disabled = false
                getAllShops(p - 1)
                return p - 1
            }
            else {
                document.getElementById("Previous").disabled = true
            }
            return p
        })
    }

    function nextPage() {
        console.log("pageCount   ", pageCount, "  have next page  ", pageCount < (documentCount / 10))
        setPageCount((p) => {
            if (p < (documentCount / 10)) {
                document.getElementById("Previous").disabled = false
                getAllShops(p + 1)
                return p + 1
            }
            else {
                document.getElementById("next").disabled = true
            }
            return p
        })

    }

    function GetStoreSale(totalSale) {
        let StoresArray = []
        const now = new Date();
        for (let i = 0; i < totalSale.length; i++) {

            const totalStores = [
                { monthSaleCount: 0, totalSale: 0 },
                { monthSaleCount: 0, totalSale: 0 }
            ]
            let totalSaleAmount = 0
            if (totalSale[i].transection.length > 0) {

                totalSale[i].transection.forEach((el) => {
                    const tempDate = new Date(el.transection_date)

                    let months;
                    months = (now.getFullYear() - tempDate.getFullYear()) * 12;
                    months -= tempDate.getMonth();
                    months += now.getMonth();
                    const difference = months <= 0 ? 0 : months;

                    totalSaleAmount = totalSaleAmount + el.sale_amount;

                    if (difference < 2) {
                        totalStores[difference].monthSaleCount = totalStores[difference].monthSaleCount + 1
                        totalStores[difference].totalSale = parseFloat((totalStores[difference].totalSale + el.sale_amount).toFixed(2))
                    }

                })
            }


            StoresArray.push({
                storeId: totalSale[i]?._id,
                storeURL: totalSale[i]?.store_url,
                totalOrders: totalSale[i]?.transection.length,
                totalSale: totalSaleAmount.toFixed(2),
                revenueThisMonth: ((totalStores[0].totalSale * 3.9) / 100).toFixed(2),
                revenueLastMonth: ((totalStores[1].totalSale * 3.9) / 100).toFixed(2),
            })
        }
        setStoresArray(StoresArray)
        setLoading(false)
    }

    useEffect(() => { getAllShops(1) }, [])
    return (
        <div className='totoal_stores_tabel'>
            {loading ?
                <h1>Loading......</h1>
                : <>
                    <h3>Total Stores {documentCount}</h3>
                    <table style={{ width: "100%", textAlign: "center" }}>
                        <thead >
                            <tr className='tabel_head_ul'>
                                <th className='indexTD'>S.N</th>
                                <th>STORE ID</th>
                                <th>STORE URL</th>
                                <th>TOTAL ORDERS</th>
                                <th>TOTAL SALES</th>
                                <th>TOTAL REVENUE</th>
                                <th>REVENUE THIS MONTH</th>
                                <th>REVENUE LAST MONTH</th>
                            </tr>
                        </thead>
                        {storesArray?.length <= 0 ?
                            <tbody>

                                <tr className='noDataFound'>
                                    <td colSpan="8"> No Data To Show</td>
                                </tr>
                            </tbody>
                            :
                            <tbody>
                                {storesArray?.map((element, index) => {
                                    return (
                                        <tr key={element?.storeId}>
                                            <td data-label="S.N" className='indexTD'>{((pageCount - 1) * 10) + index + 1}</td>
                                            <td data-label="STORE ID" >{element?.storeId}</td>
                                            <td data-label="STORE URL" >{element?.storeURL}</td>
                                            <td data-label="TOTAL ORDERS" >{element?.totalOrders}</td>
                                            <td data-label="TOTAL SALES" >$ {(element?.totalSale)?.toLocaleString()}</td>
                                            <td data-label="TOTAL REVENUE" >$ {((((element?.totalSale) * 3.9) / 100).toFixed(2))?.toLocaleString()}</td>
                                            <td data-label="REVENUE THIS MONTH" >$ {(element?.revenueThisMonth)?.toLocaleString()}</td>
                                            <td data-label="REVENUE LAST MONTH" >$ {(element?.revenueLastMonth)?.toLocaleString()}</td>
                                        </tr>
                                        // "storeID": 72813642003,
                                        // "storeURL": "new-test-55-second.myshopify.com",
                                        // "totalOrders": 1,
                                        // "totalSale": 4965.35
                                    )
                                })}
                            </tbody>}
                    </table>
                </>
            }
            <div className='paginationBtn'>
                <div className='pagination_btn'>
                    <button id='Previous' onClick={previousPage}>Previous</button>
                    <button id="next" onClick={nextPage}>Next</button>
                </div>
            </div>
        </div>

    )
}

export default Revenue
