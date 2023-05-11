const  { Router } = require( "express")

const router = Router()


// | -----------------------------------------------------|
// | Get Media Start                                      |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

router.get("/images/:filename", async (req, resp) => {
    console.log("getting the images ")
    try {
        console.log("file name is ", req.params.filename, `      ----   ${process.cwd()}/Images/${req.params.filename}`)
        // resp.sendFile()
        resp.status(200).sendFile(`${process.cwd()}/ImagesSuperAdmin/${req.params.filename}`)
    }

    catch (err) {
        console.log("it's err = require( the imaegs ", err)
        resp.status(404).json({ message: "No media found" })
    }
})

//Create a video straming link as well

// | -----------------------------------------------------|
// | Get Media End                                        |
// | All the stores route will be in this section only    |
// | ---------------------------------------------------- |

module.exports =  router