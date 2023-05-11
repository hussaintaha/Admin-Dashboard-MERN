import "../../css/table.css"
const process = import.meta.env
import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import getTheToken from "../../middleWare/getTokenFromStorage"

function NewtoresByMonth() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  async function GetAllShopsData() {
    setLoading(true)
    const verifyObject = getTheToken()
    if (verifyObject.available) {
      const resp = await fetch(`${process.VITE_BASE_URL}/stores/bymonth`, { headers: { token: verifyObject.token } })
      const result = await resp.json()
      console.log("result  ",result)
      sortDataMonthly(result.data)
    } else { alert("No token found") }
  }

  const MonthArray = [
    {
      Shops: 0,
      month: "Jan",

    },
    {
      Shops: 0,
      month: "Feb",

    },
    {
      Shops: 0,
      month: "Mar",

    },
    {
      Shops: 0,
      month: "Apr",

    },
    {
      Shops: 0,
      month: "May",

    },
    {
      Shops: 0,
      month: "Jun",

    },
    {
      month: "Jul",
      Shops: 0,

    },
    {
      month: "Aug",
      Shops: 0,

    },
    {
      month: "Sep",
      Shops: 0,

    },
    {
      month: "Oct",
      Shops: 0,

    },
    {
      month: "Nov",
      Shops: 0,

    },
    {
      month: "Dec",
      Shops: 0,

    },
  ];



  async function sortDataMonthly(ShopArray) {

    const now = new Date()
    ShopArray.map((el) => {
      const tempDate = new Date(el.createdAt)
      MonthArray[tempDate.getMonth()].Shops = MonthArray[tempDate.getMonth()].Shops + 1;
    })

    console.log("monthly array ",MonthArray)
    setData(MonthArray)
    setLoading(false)
  }

  useEffect(() => {
    GetAllShopsData()
  }, [])

  return (
    <div className='main_container'>
      <h1>New Stores Monthly</h1>
      {
        loading ?
          <h2>Loading...</h2>
          :
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
              <Bar dataKey="Shops" fill="#84c89e" />

            </BarChart>
          </ResponsiveContainer>
      }
    </div>
  )
}

export default NewtoresByMonth
