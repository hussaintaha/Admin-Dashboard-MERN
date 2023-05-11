import React, { useState, useEffect } from 'react'
const process = import.meta.env
import getTheToken from "../../middleWare/getTokenFromStorage"


function RevenueHistory() {

    const [storesArray, setStoresArray] = useState([])
    const [loading, setLoading] = useState(false)

    async function GetSaleData() {
        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/revenue/history`,{headers:{token:verifyObject.token}});
            const data = await resp.json()
            console.group("data  -=-= ", ...data.data)
            getSaleMonthly(data.data)
        }else{
            alert("No token found")
        }
    }


    async function getSaleMonthly(transectionArray) {
        const DetailsInMonth = [
            { month: "January", totalOrder: 0, amount: 1.00 },
            { month: "February", totalOrder: 0, amount: 1.00 },
            { month: "March", totalOrder: 0, amount: 1.00 },
            { month: "April", totalOrder: 0, amount: 1.00 },
            { month: "May", totalOrder: 0, amount: 1.00 },
            { month: "June", totalOrder: 0, amount: 1.00 },
            { month: "July", totalOrder: 0, amount: 1.00 },
            { month: "August", totalOrder: 0, amount: 1.00 },
            { month: "September", totalOrder: 0, amount: 1.00 },
            { month: "October", totalOrder: 0, amount: 1.00 },
            { month: "November", totalOrder: 0, amount: 1.00 },
            { month: "December", totalOrder: 0, amount: 1.00 },
            { month: "December", totalOrder: 0, amount: 1.00 }
        ]

        const now = new Date();
        transectionArray?.forEach((el) => {
            const tempDate = new Date(el.order_date)
            let months;
            // months = (now.getFullYear() - tempDate.getFullYear()) * 12;
            // months -= tempDate.getMonth();
            // months += now.getMonth();
            // const difference = months <= 0 ? 0 : months;

            const difference = tempDate.getMonth();

            console.log("difference ", difference)
            DetailsInMonth[difference].totalOrder = DetailsInMonth[difference].totalOrder + 1

            DetailsInMonth[difference].amount = Number((DetailsInMonth[difference].amount + el.transection_amount).toFixed(2))
        })

        // console.log("  DetailsInMonth  ", DetailsInMonth)
        getPercentageChange(DetailsInMonth.reverse())

    }

    async function getPercentageChange(revenueArray) {

        const arrayLength = revenueArray.length

        const tempArray = []
        revenueArray.map((el, i) => {
            if (i > 0) {
                // console.log(` el.amount    ${el.amount }   revenueArray[i-1]   ${revenueArray[i-1].amount }    (el.amount / revenueArray[i-1])*100)  ${(el.amount / revenueArray[i-1].amount)*100}`)
                // console.log("its last month   ",i ,"  ",el.amount,"  " , ((el.amount - revenueArray[i-1].amount)*100)/((el.amount + revenueArray[i-1].amount)*2)*100)
                if (el.amount < 5) {
                    tempArray.push({
                        month: el.month,
                        amount: el.amount,
                        totalOrder: 0,
                        change: 0,
                    })
                    return
                    // console.log(((el.amount-revenueArray[i-1].amount)*100).toFixed(2))
                }
                else {
                    tempArray.push({
                        month: el.month,
                        amount: el.amount,
                        totalOrder: el.totalOrder,
                        change: (((el.amount * 3.9) / 100) - ((revenueArray[i - 1].amount * 3.9) / 100) * 100).toFixed(2),
                    })
                }
            }
            console.log("tempArray ", tempArray)
        })

        setStoresArray(tempArray.reverse())
        setLoading(false)
    }


    useEffect(() => { GetSaleData() }, [])

    return (
        <div className='totoal_stores_tabel'>
            {loading ?
                <h1>Loading......</h1>
                : <>
                    <h3>Revenue History </h3>
                    <table style={{ width: "100%", textAlign: "center" }}>
                        <thead >
                            <tr className='tabel_head_ul'>
                                {/* <th className='indexTD'>S.N</th> */}
                                <th>MONTH</th>
                                <th>TOTAL ORDERS</th>
                                <th>Total Sales</th>
                                <th>TOTAL REVENUE</th>
                                <th>% CHANGE</th>
                            </tr>
                        </thead>
                        {storesArray?.length <= 0 ?
                            <tbody>
                                <tr className='noDataFound'>
                                    <td colSpan="5"> No Data To Show</td>
                                </tr>
                            </tbody>
                            :
                            <tbody>
                                {storesArray?.map((element, index) => {
                                    return (
                                        <tr key={index}>
                                            {/* <td data-label="S.N" className='indexTD'>{index + 1}</td> */}
                                            <td data-label="MONTHS" >{element?.month}</td>
                                            <td data-label="TOTAL ORDERS" >{element?.totalOrder}</td>
                                            <td data-label="TOTAL Sales" >$ {((element?.amount).toFixed(2))?.toLocaleString()}</td>
                                            <td data-label="TOTAL REVENUE" >$ {((((element?.amount) * 3.9) / 100).toFixed(2))?.toLocaleString()}</td>
                                            <td data-label="% CHANGE" >{element.change}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>}
                    </table>
                </>
            }
            {/* <div className='paginationBtn'>
        <div className='pagination_btn'>
            <button id='Previous' onClick={previousPage}>Previous</button>
            <button id="next" onClick={nextPage}>Next</button>
        </div>
    </div> */}
        </div>
    )
}

export default RevenueHistory
