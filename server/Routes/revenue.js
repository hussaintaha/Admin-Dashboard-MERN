const  { Router } = require( "express")
const  all_shops = require( "../mongo_database/all_shops_schema.js")
const  sales_schema = require( "../mongo_database/sales_schema.js")


const router = Router();

// | -----------------------------------------------------|
// | Revenue Start                                        | 
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

router.get("/total/:pageNo", async (_, resp) => {
    try {
        const tempStores = await all_shops.find({}, { _id: 1, store_url: 1, transection: { sale_amount: 1 } })
        resp.status(200).json(tempStores)
    }
    catch (err) {
        console.log("This error is = require( revernue/total ", err)
        resp.status(500).json({ message: "Some error on the server please try again later" })
    }
})

router.get("/history", async (req, resp) => {
    try {
        console.log("getting it")
        const now = new Date();
        const FromDate = new Date(now.getFullYear(), now.getMonth() - 12) // 11 month past

        let tempTransection = await sales_schema.find({ order_date: { $gte: FromDate } }, { order_date: 1, transection_amount: 1, _id: 0 })
        resp.status(200).json({ message: "Here is the total transection ", data: tempTransection })
    }
    catch (err) {
        console.log("this error is = require( revenue/history ", err)
        resp.status(500), json({ message: "some Error On the server " })
    }
})

// | -----------------------------------------------------|
// | Revenue End                                          |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |


module.exports =  router