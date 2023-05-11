
require('dotenv').config()

const express = require("express")
const cors = require("cors")
const AuthenticationRoute = require("./Routes/authentication")
const connectMongo = require("./Database/connectMongoose")
const verify = require("./middleware/verifyToken")
const Customer = require("./Routes/customer")
const Stores = require("./Routes/stores")
const Customer_supports = require("./Routes/customerSupport")
const GetMedia = require("./Routes/getMedia")
const OverView = require("./Routes/overview")
const PromoSetup = require("./Routes/promoSetup")
const Revenue = require("./Routes/revenue")
const Sales = require("./Routes/sales")
const Social = require("./Routes/social")
const authenticateToken = require("./middleware/verifyToken")
const superAdminAccess = require("./middleware/verifySupperAdmin")



const app = express()
connectMongo()

const corsOptions = {
    "origin": "http://localhost:5173",
    "methods": "GET,POST,DELETE,PUT",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

app.use(cors())

app.use(express.json())

app.get("/", verify, (req, resp) => {
    console.log("its user there   ", req.user)
    resp.status(200).json({ message: "did you called me" })
})

//login Routes
app.use("/api/auth", AuthenticationRoute)

//view only routes
app.use("/overview", authenticateToken, OverView)
app.use("/stores", authenticateToken, Stores)
app.use("/customer", authenticateToken, Customer)
app.use("/sales", authenticateToken, Sales)
app.use("/revenue", authenticateToken, Revenue)
app.use("/social", authenticateToken, Social)

//supper admin route
app.use("/support", Customer_supports)
app.use("/promo", superAdminAccess, PromoSetup)


app.use("/media", GetMedia)

app.listen(4004, () => { console.log("server listen on port no 4000") })