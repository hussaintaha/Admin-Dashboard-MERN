const  { Router } = require( "express")
const  unique_link_schema = require( "../mongo_database/unique_link_schema.js")


const router = Router()

// | -----------------------------------------------------|
// | Social Start                                         |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

router.get("/reach", async (req, resp) => {
    try {
        const tempData = await unique_link_schema.aggregate([
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
            },
            {
                $project: { createdAt: 1, user_details: 1, _id: 0 }
            }

        ])

        // const monthlyShareCount = [] 

        // const tempData = await unique_link_schema.find()
        resp.status(200).json({ message: "Here are the all transactions ", data: tempData })
    }
    catch (err) {
        console.log("This error is = require( social/reach ", err)
        resp.status(500).json({ message: "Some Error on the server" })
    }
})
// | -----------------------------------------------------|
// | Revenue End                                          |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

module.exports =  router