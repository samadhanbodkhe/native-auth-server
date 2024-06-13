const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config({ path: "./.env" })

mongoose.connect(process.env.MONGO_URL)

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors())

app.use("/api/v1/auth", require("./routes/authRoute"))
app.use("*", (req, res) => {
    res.status(404).json({ message: "resource not found" })
})

mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(process.env.PORT, console.log("SERVER RUNNING"))
})