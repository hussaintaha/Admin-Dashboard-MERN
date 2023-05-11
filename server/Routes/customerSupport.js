const  { Router } = require( "express")
const  customer_supports = require( "../mongo_database/customer_support_schema.js")
const  faq_schema = require( "../mongo_database/faq_schema.js")
const superAdminAccess  = require("../middleware/verifySupperAdmin.js")
const authenticateToken = require("../middleware/verifyToken")

const router = Router()

// | -----------------------------------------------------|
// | Customer Support Start                               |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

router.post("/contactinfo", superAdminAccess , async (req, resp) => {
    try {
        if (req.body) {

            console.log("body is ", req.body)

            const availabelContactInfo = await customer_supports.findOne({})

            if (availabelContactInfo) {

                await customer_supports.findOneAndUpdate({},
                    {
                        phone_number: req.body.phone_number,
                        email_address: req.body.email_address,
                        support_handal: req.body.social_handal
                    }
                )
                console.log("tempSave updated  ")
                resp.status(200).json("Contact information was updated successfully")
            }
            else {

                const newContact = await customer_supports({
                    phone_number: req.body.phone_number,
                    email_address: req.body.email_address,
                    support_handal: req.body.social_handal
                }
                )
                await newContact.save()
                console.log("tempSave saved ")
                resp.status(200).json("Contact information was added successfully")
                return
            }
            return
        }
        resp.status(404).json("No Data Found To Update")

    }
    catch (err) {
        console.log("its error = require( support/contactInfo  ", err)
        resp.status(500).json("Server is under load please try again later")
    }
})

router.get("/contactinfo", authenticateToken ,async (req, resp) => {
    try {

        console.log("body is ", req.body)

        const ContactInfo = await customer_supports.findOne({},
            {
                phone_number: 1,
                email_address: 1,
                support_handal: 1,
                _id: 0
            }
        )
        resp.status(200).json({ message: "Here is the Contact Information", data: ContactInfo })
        return
    }
    catch (err) {
        console.log("its error = require( support/contactInfo  ", err)
        resp.status(500).json({ message: "Server is under load please try again later" })
    }
})

router.get("/faq_list",authenticateToken , async (req, resp) => {
    try {
        // if(req.params.pageNo){
        const tempList = await faq_schema.find({})
        resp.status(200).json({ message: "Here is the most frequently asked questions = require( us", data: tempList })
        // }
        // else{
        //     resp.status(404).json({message:"Cant find a page for this route"})
        // }
    }
    catch (err) {
        console.log("This error is = require( /support/faq_list ", err)
        resp.status(500).json({ message: "Server is busy pleasr try again later" })
    }
})

router.get("/faq/:id",superAdminAccess, async (req, resp) => {
    try {
        console.log("calling faq -=-=--==-=-=--=-=")
        // if(req.params.pageNo){
        const tempList = await faq_schema.findById(req.params.id)
        resp.status(200).json({ message: "Here is the most frequently asked questions = require( us", data: tempList })
        // }
        // else{
        //     resp.status(404).json({message:"Cant find a page for this route"})
        // }
    }
    catch (err) {
        console.log("This error is = require( /support/faq_list ", err)
        resp.status(500).json({ message: "Server is busy pleasr try again later" })
    }
})

router.post("/faq_question", authenticateToken ,async (req, resp) => {
    try {
        console.log(" /support/faq_question")
        if (req.body) {
            const tempFaqQuestion = new faq_schema({
                question: req.body.question,
                answer: req.body.answer
            })
            await tempFaqQuestion.save()
            resp.status(200).json({ message: "New Question Added" })
        } else {
            resp.status(202).json({ message: "Content body is a must field to create a FAQ" })
        }
    } catch (err) {
        console.log("This error is = require( /support/saq_question  ", err)
        resp.status(500).json({ message: "server is busy doing some task" })
    }
})

router.post("/faq/update/:id", superAdminAccess , async (req, resp) => {
    try {
        if (req.body) {
            await faq_schema.findByIdAndUpdate(req.params.id, { question: req.body.question, answer: req.body.answer })

            resp.status(200).json({ message: "Data updated sucessfully" })
        }
        else {
            resp.status(202).json({ message: "Sorry but no data found to update" })
        }
    }
    catch (err) {
        console.log("this error is = require( support/faw/update/:id ", err)
        resp.status(500).json({ message: "Server is under load try again later" })
    }
})

router.delete("/faq/delete/:id", superAdminAccess , async (req, resp) => {
    try {
        if (req.params.id) {
            if (req.params.id.length == 24) {

                await faq_schema.findByIdAndDelete(req.params.id)
                resp.status(200).json({ message: "FAQ deleted successfully" })
                return
            }
            resp.status(202).json({ message: "Not a valid id" })
            return
        }
        resp.status(404).json({ message: "There is no id to delete" })
    }
    catch (err) {
        console.log("this error is = require( /support/faq/delete/:id  ", err)
        resp.status(500).json({message:"Please try again later"})
    }
})

// | -----------------------------------------------------|
// | Customer Support End                                 |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

module.exports =  router;