const  { Router } = require( "express")
const  all_shops = require( "../mongo_database/all_shops_schema.js")
const  sales_schema = require( "../mongo_database/sales_schema.js")
const  unique_link_schema = require( "../mongo_database/unique_link_schema.js")

const router = Router()


// | -----------------------------------------------------|
// | OverView Start                                       |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |


router.get("/", async (req, resp) => {

    //total social rrach
    try {


        const allShops = await all_shops.find();
        const totalCustomer = await unique_link_schema.find();
        const totalSale = await sales_schema.find();

        const allUserVisited = await unique_link_schema.aggregate([
            {
                $match: {}
            },
            {
                $unwind: "$users_all_campaigns"
            },
            {
                $match: {}
            },
            {
                $replaceRoot: {
                    newRoot: "$users_all_campaigns"
                }
            }
        ])


        // console.log("totalSocialReach  ", totalSocialReach)
        const saleArray = [
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
            { monthSaleCount: 0, totalSale: 0 },
        ]

        const avgOrderSize = { total: 0, count: 0 }

        function GetAvgOrderSize(totalSale) {
            const now = new Date();
            totalSale?.forEach((el, i) => {

                avgOrderSize.total = Number((avgOrderSize.total + el.transection_amount).toFixed(2))
                avgOrderSize.count = avgOrderSize.count + 1

                const tempDate = new Date(el.order_date)

                let months;
                months = (now.getFullYear() - tempDate.getFullYear()) * 12;
                months -= tempDate.getMonth();
                months += now.getMonth();
                const difference = months <= 0 ? 0 : months;

                console.log("difference ", difference)

                saleArray[difference].monthSaleCount = saleArray[difference].monthSaleCount + 1
                console.log(`${saleArray[difference].totalSale} +  ${el.transection_amount}  =  ${Number((Number((saleArray[difference].totalSale).toFixed(2)) + el.transection_amount).toFixed(2))}`)
                saleArray[difference].totalSale = Number((Number((saleArray[difference].totalSale).toFixed(2)) + el.transection_amount).toFixed(2))

            })
        }

        GetAvgOrderSize(totalSale);

        let totalSocialReach = 0;

        function GetTotalSocialReach(allUserVisited) {
            totalSocialReach = allUserVisited.reduce((total, el) => {
                return total = total + el.user_details.length
            }, 0)
        }

        GetTotalSocialReach(allUserVisited)
        console.log("saleArray  ", saleArray)



        // resp.status(200).json({allShops:allShops,totalCustomer:totalCustomer,totalSale:totalSale})
        resp.status(200).json({
            message: "It's overview detail",
            data: {
                totalStores: allShops.length,
                totalCustomer: totalCustomer.length,
                thisMonth: { revenue: ((saleArray[0].totalSale * 3.9) / 100).toFixed(2), orders: saleArray[0].monthSaleCount },
                lastMonth: { revenue: ((saleArray[1].totalSale * 3.9) / 100).toFixed(2), orders: saleArray[1].monthSaleCount },
                avgOrderSize: avgOrderSize,
                totalShare: allUserVisited.length,
                totalFriendsReach: totalSocialReach,
                totalRevenue: ((avgOrderSize.total * 3.9) / 100).toFixed(2)
            }
        })
    } catch (err) {
        console.log(err)
        resp.status(500).json({ message: "Not Authorized" })
    }
})


// | -----------------------------------------------------|
// | Overview End                                         |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

module.exports =  router