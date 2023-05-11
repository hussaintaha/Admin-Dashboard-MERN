const  { Router } = require( "express")
const  all_shops = require( "../mongo_database/all_shops_schema.js")
const  sales_schema = require( "../mongo_database/sales_schema.js")


const router = Router()

// | -----------------------------------------------------|
// | Sales Start                                          |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

router.get("/allstorename", async (req, resp) => {
    try {
        const allShopsName = await all_shops.find({}, { store_name: 1, _id: 1 })
        console.log("allShopsName    ", allShopsName)
        resp.status(200).json({ message: " Here is the responce ", data: allShopsName })
    }
    catch (err) {
        console.log("This err is while getting all the shops ")
        resp.status(500).json("Server have some problem please visit after some time")
    }
})

router.get("/history/all/:pageNo", async (req, resp) => {
    try {
        const saleHistoryCount = await sales_schema.find({}).countDocuments();
        const TempHistory = await sales_schema.find({}, { user_id: 0, _id: 0 }).sort({ _id: -1 }).limit(10).skip((req.params.pageNo - 1) * 10)
        resp.status(200).json({ message: "Here is the all history", data: { array: TempHistory.reverse(), saleHistoryCount: saleHistoryCount } })
    } catch (err) {
        console.log("err = require( the sales history route ", err)
        resp.status(500).json({ message: "Sorry Server is bussy try again later" })
    }
})

// Here is route to get the sales data by stores name
router.post("/historybystore", async (req, resp) => {
    //use the request to get the shopID
    try {
        console.log("body is    ", req.body)

        const salesCount = await sales_schema.find({ store_ID: req.body.storeID }).countDocuments();
        console.log("salesCount  -=- ", salesCount)
        const TempSale = await sales_schema.find({ store_ID: req.body.storeID }, { order_date: 1, transection_ID: 1, user_last: 1, user_first: 1, user_email: 1, transection_amount: 1, _id: 0 }).sort({ _id: -1 }).limit(10).skip((req.body.pageNo - 1) * 10)
        console.log("dta found are ", TempSale.length)
        resp.status(200).json({ message: "Here is the all history", data: { array: TempSale, salesCount: salesCount } })
    } catch (err) {
        console.log("err = require( the sales history route ", err)
        resp.status(500).json({ message: "Sorry Server is bussy try again later" })
    }
})

// this section is responcible for the performance
router.get("/performance", async (req, resp) => {
    try {
        const now = new Date();
        const FromDate = new Date(now.getFullYear(), now.getMonth() - 11)
        const TempSaleData = await sales_schema.find({ order_date: { $gte: FromDate, $lte: now } }, { transection_amount: 1, order_date: 1, _id: 0 })
        resp.status(200).json({ message: `All the transection between ${FromDate.toLocaleDateString()} - ${now.toLocaleDateString()}`, data: TempSaleData })
    } catch (err) { console.log("The error is in the sales/performance", err), resp.status(500).json({ message: "Server is having lot of work right now" }) }
})

// | -----------------------------------------------------|
// | Sales End                                            |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

module.exports =  router