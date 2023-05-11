const  { Router } = require( "express")
const  all_shops = require( "../mongo_database/all_shops_schema.js")



const router = Router()

// | -----------------------------------------------------|
// | Stores  Start                                        |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |


// Totoal stores availabel
router.get("/totalStores/:pageNo", async (req, resp) => {

    try {

        const dataCount = await all_shops.countDocuments();
        const allStores = await all_shops.find({}, { _id: 1, store_url: 1, unistalled: 1, transection: { sale_amount: 1, transection_date: 1 } }).sort({ _id: -1 }).limit(10).skip((req.params.pageNo - 1) * 10)
        resp.status(200).json({ message: "getting your responce", data: { array: allStores, dataCount: dataCount } })
    }
    catch (err) {
        console.log("this error is = require( the total store get route super admin ",err)
        resp.status(500).json({ message: "Server IS busy try again later" })
    }
})

// Total New Stores This Month
router.get("/newStores/:pageNo", async (req, resp) => {

    // change the order date to created date and also sales_schema to All_shop schema
    try {
        const now = new Date();

        const FromDate = new Date(now.getFullYear(), now.getMonth() + 0, 1); // month/day
        const ToDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const newStoresCount = await all_shops.find({ createdAt: { $gte: FromDate, $lte: ToDate } }).countDocuments();
        // console.log("newStoresCount   ",newStoresCount)

        const tempNewStores = await all_shops.find({ createdAt: { $gte: FromDate, $lte: ToDate } }, { _id: 1, store_url: 1, transection: { transection_date: 1, sale_amount: 1 } }).sort({ _id: -1 }).limit(10).skip((req.params.pageNo - 1) * 10)
        resp.status(200).json({ message: "all good", data: { array: tempNewStores, newStoresCount: newStoresCount } })
    } catch (err) {
        console.log("the error is = require( stores newStore route ", err)
        resp.status(500).json({ message: "Some Error on the server" })
    }
})

// Total New Stores Last Month:
router.get("/lastmonthStores/:pageNo", async (req, resp) => {

    try {
        const now = new Date();
        const FromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); // month/day
        const ToDate = new Date(now.getFullYear(), now.getMonth() + 0, 1);
        console.log(`= require( ${FromDate} to ${ToDate}`)

        const newStoresCount = await all_shops.find({ createdAt: { $gte: FromDate, $lte: ToDate } }).countDocuments();

        const tempNewStores = await all_shops.find({ createdAt: { $gte: FromDate, $lte: ToDate } }, { _id: 1, store_url: 1, transection: { transection_date: 1, sale_amount: 1 } }).sort({ _id: -1 }).limit(10).skip((req.params.pageNo - 1) * 10)
        resp.status(200).json({ message: "all good", data: { array: tempNewStores, newStoresCount: newStoresCount } })
    } catch (err) {
        console.log("The error is in stores/lastmonthStores  ", err)
        resp.status(500).json({ message: "Some Error on the server" })
    }
})

// New Stores by Month on a chart
router.get("/bymonth", async (req, resp) => {
    try {
        const now = new Date();
        const FromDate = new Date(now.getFullYear(), now.getMonth() - 11) // 11 month past

        const tempNewStores = await all_shops.find({ createdAt: { $gte: FromDate } }, { createdAt: 1, _id: 0 })
        console.log("shop by month ",tempNewStores)
        resp.status(200).json({ message: "all good here is data of last one year in month format", data: tempNewStores })
    } catch (err) {
        console.log("The error is in stores/bymoth  ", err)
        resp.status(500).json({ message: "Some Error on the server" })
    }
})


// | -----------------------------------------------------|
// | Stores End                                           |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

module.exports =  router