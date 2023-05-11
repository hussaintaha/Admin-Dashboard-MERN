const  fs = require( "fs")
const  path = require( "path")
const  { Router } = require( "express")
const  converter = require( "json-2-csv")
const  unique_link_schema = require( "../mongo_database/unique_link_schema.js")
const authenticateToken  = require("../middleware/verifyToken.js")

const router = Router()

// | -----------------------------------------------------|
// | Customer Start                                       |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

//super admin route

router.get("/private/excel",authenticateToken,async (_, resp) => {

    try {
        const tempUserData = await unique_link_schema.find({}, { _id: 0, user_all_transectionL: 1, user_first_name: 1, user_last_name: 1, user_email: 1, all_registered_shops: 1 }).sort({ _id: -1 });

        const customers = []

        tempUserData.forEach((elP) => {
            let TempTotal = 0
            let TempShop = []
            elP.user_all_transectionL.forEach((elC) => {
                TempTotal = Number((TempTotal + elC.total_amount).toFixed(2))
            })

            elP.all_registered_shops.forEach((shop) => {
                if (!TempShop.includes(shop)) {
                    TempShop.push(shop)
                }
            })
            customers.push({
                First_Name: elP.user_first_name,
                Last_Name: elP.user_last_name,
                Email: elP.user_email,
                Number_Of_Order: elP.user_all_transectionL.length,
                Total_Amount: TempTotal,
                All_Shops: TempShop.toString().replace(",", "\n")
            })
        })

        const csv = await converter.json2csv(customers);
        fs.writeFileSync(`${process.cwd()}/Excel/customers.csv`, csv)

        resp.status(200).download(`${process.cwd()}/Excel/customers.csv`)
    }
    catch (err) {
        console.log("this error is = require( customer excel route ", err)
        resp.status(500).json({ message: "There is some problem downloading the excel file", path: path.dirname })
    }
})

router.get("/:pageNo", async (req, resp) => {

    try {

        console.log("pageno  ", req.params.pageNo)

        if (!isNaN(req.params.pageNo)) {

            const customerCount = await unique_link_schema.find().countDocuments()
            const tempUserData = await unique_link_schema.find({}, { _id: 0, user_all_transectionL: 1, user_first_name: 1, user_last_name: 1, user_email: 1 }).sort({ _id: -1 }).limit(10).skip((req.params.pageNo - 1) * 10)
            console.log("temsp user data ", tempUserData)

            const tempArray = []
            tempUserData.forEach((elP) => {
                let TempTotal = 0

                elP.user_all_transectionL.forEach((elC) => {
                    TempTotal = Number((TempTotal + elC.total_amount).toFixed(2))
                })

                tempArray.push({
                    user_first_name: elP.user_first_name,
                    user_last_name: elP.user_last_name,
                    user_email: elP.user_email,
                    total: TempTotal,
                    totalOrder: elP.user_all_transectionL.length
                })

                TempTotal = 0
            })
            // console.log(tempArray)

            resp.status(200).json({ message: "Here are all the customers", data: { array: tempArray, customerCount: customerCount } })
        }
        else {
            resp.status(404).json({ message: "Page no can't be a string" })
        }

    }
    catch (err) {
        console.log("here is the err = require( get customer list ", err)
        resp.status(500).json({ message: "There is some problem on the server" })
    }
})

// | -----------------------------------------------------|
// | Customer End                                         |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

module.exports =  router