const process = import.meta.env
import "../../css/performance.css"
import React, { useState, useEffect } from 'react'
import getTheToken from "../../middleWare/getTokenFromStorage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Performance() {

    const [data, setData] = useState([])
    const [cardData, setCardData] = useState([])
    const [loading, setLoading] = useState(false)

    async function GetAllShopsData() {
        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/sales/performance`,{
                headers:{token:verifyObject.token}
            })
            const result = await resp.json()
            sortDataMonthly(result.data)
        }
        else {
            alert("No token available")
        }
    }

    const MonthArray = [
        {
            month: "Jan",
            count: 0,
            total: 0,
        },
        {
            month: "Fab",
            count: 0,
            total: 0,
        },
        {
            month: "Mar",
            count: 0,
            total: 0,
        },
        {
            month: "Apr",
            count: 0,
            total: 0,
        },
        {
            month: "May",
            count: 0,
            total: 0,
        },
        {
            month: "Jun",
            count: 0,
            total: 0,
        },
        {
            month: "Jul",
            count: 0,
            total: 0,
        },
        {
            month: "Aug",
            count: 0,
            total: 0,
        },
        {
            month: "Sep",
            count: 0,
            total: 0,
        },
        {
            month: "Oct",
            count: 0,
            total: 0,
        },
        {
            month: "Nov",
            count: 0,
            total: 0,
        },
        {
            month: "Dec",
            count: 0,
            total: 0,
        },
    ];

    const cardObj = [{ sale: 0, volume: 0 }, { sale: 0, volume: 0 }]

    async function sortDataMonthly(ShopArray) {

        const now = new Date()
        ShopArray.map((el) => {

            console.log(el)
            const tempDate = new Date(el.order_date)

            let months;
            months = (now.getFullYear() - tempDate.getFullYear()) * 12;
            months -= tempDate.getMonth();
            months += now.getMonth();
            const difference = months <= 0 ? 0 : months;

            // console.log("difference ", count : 0 ,total : 0,difference)

            // console.log("count ", tempDate.getMonth())
            if (difference < 2) {
                cardObj[difference].sale = Number((cardObj[difference].sale + el.transection_amount).toFixed())
                cardObj[difference].volume = cardObj[difference].volume + 1
            }


            MonthArray[tempDate.getMonth()].count = MonthArray[tempDate.getMonth()].count + 1;
            MonthArray[tempDate.getMonth()].total = Number((MonthArray[tempDate.getMonth()].total + el.transection_amount).toFixed(2));
        })
        // console.log(MonthArray)
        console.log("card obj  ", cardObj)
        setData(MonthArray)
        setCardData(cardObj)
        setLoading(false)
    }

    useEffect(() => {
        GetAllShopsData()
    }, [])


    // static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

    return (
        <div className='main_container'>
            <h1 className='tab_heading'>Number of Sales By Month</h1>
            {
                loading ?
                    <h1>Loading...</h1>
                    :
                    <div className='performance_container'>
                        <div className='sub_container'>
                            <h3>Sales By Month</h3>
                            <div className='container_item'>
                                <div className='singelCard_parent'>
                                    <div className="singel_card" >
                                        <div className="box_content">
                                            <div className="heading_area">
                                                <div className="bold_txt">
                                                    <h3>This Months
                                                    </h3>
                                                </div>
                                                <h3>{cardData[0]?.volume}</h3>
                                            </div>
                                            <div className="box_icon">
                                                <img src={`${process.VITE_BASE_URL}/media/images/total-sales.png`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="singel_card" >
                                        <div className="box_content">
                                            <div className="heading_area">
                                                <div className="bold_txt">
                                                    <h3>Last Months
                                                    </h3>
                                                </div>
                                                <h3>{cardData[1]?.volume}</h3>
                                            </div>
                                            <div className="box_icon">
                                                <img src={`${process.VITE_BASE_URL}/media/images/total-sales.png`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='chart_div'>

                                    <ResponsiveContainer width="100%" aspect={2}>
                                        <BarChart
                                            data={data}
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
                                            <Bar dataKey="count" fill="#84c89e" />

                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className='sub_container'>
                            <h3>Sales Volume By Month</h3>
                            <div className='container_item' >
                                <div className='singelCard_parent'>
                                    <div className="singel_card" >
                                        <div className="box_content">
                                            <div className="heading_area">
                                                <div className="bold_txt">
                                                    <h3>This Months
                                                    </h3>
                                                </div>
                                                <h3>$ {((cardData[0]?.sale)?.toFixed(2))?.toLocaleString()}</h3>
                                            </div>
                                            <div className="box_icon">
                                                <img src={`${process.VITE_BASE_URL}/media/images/total-sales.png`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="singel_card" >
                                        <div className="box_content">
                                            <div className="heading_area">
                                                <div className="bold_txt">
                                                    <h3>Last Months
                                                    </h3>
                                                </div>
                                                <h3>$ {((cardData[1]?.sale)?.toFixed(2))?.toLocaleString()}</h3>
                                            </div>
                                            <div className="box_icon">
                                                <img src={`${process.VITE_BASE_URL}/media/images/total-sales.png`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='chart_div'>

                                    <ResponsiveContainer width="100%" aspect={2}>
                                        <BarChart
                                            data={data}
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
                                            <Bar dataKey="total" fill="#84c89e" />

                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                    </div>
            }
        </div>
    )
}


export default Performance
