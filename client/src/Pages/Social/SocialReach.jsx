import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../../css/social_reach.css"
const process = import.meta.env
import getTheToken from "../../middleWare/getTokenFromStorage"


function SocialReach() {

    const [shareArray, setShareArray] = useState([]);
    const [loading, setLoading] = useState(false)

    async function GetShareCount() {
        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/social/reach`, {
                headers: { token: verifyObject.token }
            })
            const daata = await resp.json();
            GetReachMonthly(daata.data)
        } else { alert("No token found") }
    }

    function GetReachMonthly(reachCount) {

        const DetailsInMonth = [
            { TotalFriendsReached: 0, TotalShares: 0, month: "Jan" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Feb" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Mar" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Apr" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "May" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Jun" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Jul" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Aug" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Sep" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Oct" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Nov" },
            { TotalFriendsReached: 0, TotalShares: 0, month: "Dec" },
        ]

        const now = new Date();

        reachCount?.forEach((el) => {
            // console.log("reach count  ", el)
            const tempDate = new Date(el.createdAt)
            const difference = tempDate.getMonth()
            DetailsInMonth[difference].TotalShares = DetailsInMonth[difference].TotalShares + 1
            DetailsInMonth[tempDate.getMonth()].TotalFriendsReached = DetailsInMonth[tempDate.getMonth()].TotalFriendsReached + el.user_details.length
        })

        setShareArray(DetailsInMonth)
        setLoading(false)

    }


    useEffect(() => {
        GetShareCount();
    },
        [])

    return (
        <div className='social_container'>
            <h1>Social Reach</h1>
            {loading ?
                <h1>Loading...</h1>
                :
                <div className='social_container_child'>
                    <div className='header_div'>
                        <div className='single_card'>
                            <div className="heading-area">
                                <div className="bold-txt">
                                    <h3>This Month Reach</h3>
                                </div>
                                {/* shareArray[0]?.TotalFriendsReached  */}
                                <h3>{shareArray[new Date().getMonth()]?.TotalFriendsReached}</h3>
                            </div>
                            <div className="box-icon">
                                <img src={`${process.VITE_BASE_URL}/media/images/total-social.png`} />
                            </div>
                        </div>
                        <div className='single_card'>
                            <div className="heading-area">
                                <div className="bold-txt">
                                    <h3>Last Month Reach</h3>
                                </div>
                                <h3>{new Date().getMonth() == 0 ? shareArray[11]?.TotalFriendsReached : shareArray[new Date().getMonth() - 1]?.TotalFriendsReached}</h3>
                            </div>
                            <div className="box-icon">
                                <img src={`${process.VITE_BASE_URL}/media/images/total-social.png`} />
                            </div>
                        </div>
                    </div>

                    <div className='chart_div'>
                        <ResponsiveContainer width="80%" aspect={2}>
                            <BarChart
                                data={shareArray}
                                margin={{
                                    top: 50,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                {/* <CartesianGrid strokeDasharray="3 3" opacity={0.5} /> */}
                                <CartesianGrid opacity={0.2} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="TotalShares" fill="#ef2c35" />
                                <Bar dataKey="TotalFriendsReached" fill="#84c89e" />

                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            }
        </div >
    )
}

export default SocialReach
