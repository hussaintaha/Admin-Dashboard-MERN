
require('dotenv').config()

const nodemailer = require("nodemailer")
const router = require("express").Router();
const User = require("../models/user")
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const user = require('../models/user');


console.log("SECRET_KEY     ",process.env.SECRET_KEY)

//Register
router.post("/register", async (req, resp) => {

    console.log("body is ", req.body)

    try {
        const newuser = new User({
            userName: req.body.username,
            userEmail: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
        });

        await newuser.save()

        const { password, isSuperAdmin, ...info } = await newuser._doc
        resp.status(201).json(info)
        console.log(info);

    } catch (err) {
        console.log("its err ", err)
        resp.status(500).json(err)
    }
})

//login
router.post("/login", async (req, resp) => {
    try {
        console.log("body is  ", req.body)
        if (Object.values(req.body).length > 0) {

            const user = await User.find({ userEmail: req.body.email })

            if (user.length > 0) {

                let bytes = CryptoJS.AES.decrypt(user[0].password, process.env.SECRET_KEY);
                console.log("bytes  ", bytes)

                let originalPassword = bytes.toString(CryptoJS.enc.Utf8);

                console.log("original password ", originalPassword)

                if (req.body.password > 5 && originalPassword !== req.body.password) {
                    console.log(originalPassword)
                    resp.status(401).json("Wrong Password")
                    return
                }

                else {
                    console.log(user[0].id, "    ", user[0].isSuperAdmin)

                    const accessToken = jwt.sign({ id: user[0].id, isAdmin: user[0].isSuperAdmin }, process.env.JWT_KEY, { expiresIn: "5 days" })
                    resp.status(200).json({ message: "Login successfully", accessToken: accessToken });
                    return
                }
            }

            else {
                resp.status(404).json({ message: "no user found with this detail" })
                return
            }
        }
        else {

            resp.status(404).json({ message: "No page found" })
            console.log("No page found")
            return
        }
    }
    catch (err) {
        console.log("executing catch ", err)
        resp.status(500).json(err);
    }
})


router.post("/reset", async (req, resp) => {
    // Logic to send the password reset code to the email address

    const transporter = nodemailer.createTransport(({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: "apikey",
            pass: process.env.SENDGRID_API_KEY
        }
    }));

    try {
        console.log("its reset path ")

        if (req.body.email.length > 5) {
            const email = req.body.email.slice(0, 3) + "****" + req.body.email.split("@")[0].slice(-2) + "@" + req.body.email.split("@")[1]

            const adminDetail = await user.find({ userEmail: req.body.email })

            if (adminDetail.length > 0) {
                console.log("found the user")
                const ResetCode = Math.random().toString(36).slice(2)
                try {
                    await user.findByIdAndUpdate(adminDetail[0]._id, { forgetPassword: true, verificationCode: ResetCode })

                    // Write logic to send the email to the server 

                    try {
                        await transporter.sendMail({
                            from: `"Admin" <${process.env.SENDGRID_EMAIL}>`,
                            to: `${req.body.email}`,
                            subject: "Reset Admin Password",
                            text: `Hello Admin. Here is the code to recovery your account password ${ResetCode}. Don't share this with anyone and if not requested for this please contact devlopment Team.`,

                            html: `Hello Admin. Here is the <u>Recovery Code</u> for your account password <b>${ResetCode}</b>. Don't share this with anyone and if not requested for this please contact <i>development Team</i>.`,
                        });

                        // console.log("15 mail info ", info);
                    } catch (err) { console.log("err from mail sending ", err) }

                    // Logic to send email
                    console.log("resp sent ")
                    resp.status(200).json({ message: `Recovery Code sent to your email ${email}`, user: req.body.email })

                    return
                } catch (err) {
                    console.log("some error occured while storing code ", err)
                    resp.status(202).json({ message: "Server can't generate the code Please try again" })
                }
            }
            else {
                console.log("no user found to reset the password")
                resp.status(200).json({ message: `No user found with this email ${email}` })
                return
            }
        }
    } catch (err) {

        console.log("its err while reseting the user password ", err)
        resp.status(500).json({ message: "Its error while reseting the admin password" })
    }

})


router.post("/verify", async (req, resp) => {
    console.log("verfiy  ", req.body)
    try {
        if (req.body.verificationCode.length == 10) {
            const adminDetail = await user.find({ verificationCode: req.body.verificationCode })
            if (adminDetail.length > 0) {
                console.log(adminDetail)
                if (req.body.verificationCode == adminDetail[0].verificationCode) {
                    console.log("true")
                    await user.findOneAndUpdate({ verificationCode: req.body.verificationCode },
                        {
                            forgetPassword: false,
                            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
                        })

                    resp.status(200).json("Password updated successfuly")
                    return
                }
                resp.status(202).json({ message: "The reset code is not Currect" })
                return
            }
            resp.status(404).json({ message: "No code found" })
            return
        }
        resp.status(404).json({ message: "No code found" })
        return
    }
    catch (err) {
        console.log("err while checking reset code ", err)
        resp.status(500).json({ message: "server is busy for now please try again later" })
    }
})

router.get("/verifytoken", async (req, resp) => {


    const token = req.headers.token;

    console.log("token  ", req.headers.token)

    if (token) {

        let abc = jwt.decode(token)

        console.log("decoded token ", abc)

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                console.log("user not found")
                resp.status(403).json("Token is not valid")
                return
            };
            if (user) {
                console.log("user is ",user)
                resp.status(200).json({message:"Token is valid",accessToken:req.headers.token})
                return
            }

            // req.user = user;
            // next();
        })
        // console.log("decode  ",decode)
    }

    else {
        return resp.status(401).json("You are not authorised")
    }

})


module.exports = router;