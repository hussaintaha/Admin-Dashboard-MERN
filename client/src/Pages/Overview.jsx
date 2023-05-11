// import React, { useState } from 'react'
import "../css/overview.css"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
const process = import.meta.env
import getTheToken from "../middleWare/getTokenFromStorage"

function Overview() {

    const [overviewData, setOverviewData] = useState({})
    const [loading, setLoading] = useState(false)

    async function getAddData() {

        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/overview`, {
                headers: {
                    token: verifyObject.token
                }
            })
            const data = await resp.json()
            setOverviewData(data.data)
            setLoading(false)
        } else {
            alert("No token found")
        }
    }

    useEffect(() => {
        getAddData()
    }, [])


    return (
        <div id="clickMe" className="main_content">
            {loading ?
                <div className="loadingDiv">
                    <h1>Loading......</h1>
                </div>
                :
                <div className="actualDiv">
                    <div className="boxes">

                        <Link className="singel_card" to="/stores/totalstores">
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Total Stores</h2>
                                    </div>
                                    <h3>{overviewData?.totalStores}</h3>
                                </div>
                                <div className="box_icon">
                                    <img src={`${process.VITE_BASE_URL}/media/images/store-icon.png`} />
                                </div>
                            </div>
                        </Link>

                        <Link className="singel_card" to="/customer" >
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Total Customers</h2>
                                    </div>
                                    <h3>{overviewData?.totalCustomer}</h3>
                                </div>
                                <div className="box_icon">
                                    <img src={`${process.VITE_BASE_URL}/media/images/customer.png`} />
                                </div>
                            </div>
                        </Link>

                        <Link className="singel_card" to="/sales/history">
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Total Sales </h2>
                                    </div>
                                    <h3>${(overviewData?.avgOrderSize?.total)?.toLocaleString()}</h3>
                                </div>
                                <div className="box_icon">
                                    <img src={`${process.VITE_BASE_URL}/media/images/total-sales.png`} />
                                </div>
                            </div>
                        </Link>

                        <div className=" singel_card">
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Total Orders</h2>
                                    </div>
                                    <div className="flex_row">
                                        <div className="sub_details">
                                            <div className="sub_details_heading">
                                                <h5 className="box_link">This Month</h5>
                                                <div>
                                                    <h3>{overviewData?.thisMonth?.orders}</h3>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="sub_details">
                                            <div className="sub_details_heading">
                                                <h5 className="box_link">Last Month</h5>
                                                <div>
                                                    <h3>{overviewData?.lastMonth?.orders}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box_icon">
                                    <img src={`${process.VITE_BASE_URL}/media/images/total-order.png`} />
                                </div>
                            </div>
                        </div>

                        <Link className="singel_card" to="/revenue/total">
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Total Revenue</h2>
                                    </div>
                                    <h3>${(overviewData?.totalRevenue)?.toLocaleString()}</h3>
                                </div>
                                <div className="box_icon">
                                    <img src={`${process.VITE_BASE_URL}/media/images/revenue.png`} />
                                </div>
                            </div>
                        </Link>

                        <Link className=" singel_card" to="/revenue/total">
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Revenue</h2>
                                    </div>
                                    <div className="flex_row">
                                        <div className="sub_details">
                                            <div className="sub_details_heading">
                                                <h5>This Month</h5>
                                            </div>
                                            <h3>${(overviewData?.thisMonth?.revenue)?.toLocaleString()}</h3>
                                        </div>
                                        <div className="sub_details">
                                            <div className="sub_details_heading">
                                                <h5>Last Month</h5>
                                            </div>
                                            <h3>${(overviewData?.lastMonth?.revenue)?.toLocaleString()}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="box_icon">
                                    <img src={`${process.VITE_BASE_URL}/media/images/discount.png`} />
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="two_boxes">
                        {/* <div className="large_singel_card "> */}
                        <Link className="large_singel_card singel_card " to="/social/reach">
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Total Social Reach</h2>
                                    </div>
                                    <div className="flex_row">
                                        <div className="sub_details">
                                            <div className="sub_details_heading">
                                                <h5 className="box_link">Total Shares</h5>
                                                <div>
                                                    <h3>{overviewData?.totalShare}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sub_details">
                                            <div className="sub_details_heading">
                                                <h5 className="box_link">Total Friends Reached</h5>
                                                <div>
                                                    <h3>{overviewData?.totalFriendsReach}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box_icon">
                                <img src={`${process.VITE_BASE_URL}/media/images/total-social.png`} />
                            </div>
                        </Link>

                        {/* </div> */}

                        <div className="large_singel_card singel_card">
                            <div className="box_content">
                                <div className="heading_area">
                                    <div className="bold_txt">
                                        <h2>Average Order size</h2>
                                    </div>
                                    <h3>${((overviewData?.avgOrderSize?.total / (overviewData?.avgOrderSize?.count ? overviewData?.avgOrderSize?.count : 1)).toFixed(2))?.toLocaleString()}</h3>
                                </div>
                                <div className="box_icon">
                                    <img src={`${process.VITE_BASE_URL}/media/images/order-size.png`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={getAddData} className="refreshBtn"> Refresh</button>
                    {/* <a rel="nofollow noopener noreferrer" href="https://www.facebook.com/dialog/send?app_id=546086217352494&amp;link=https://crunchify.me/40m6mxe&amp;redirect_uri=https%3A%2F%2Fcrunchify.com" target="_blank" title="Share on Facebook Messenger">Go to messanger</a> */}
                </div>
            }
        </div>
    )
}

export default Overview
