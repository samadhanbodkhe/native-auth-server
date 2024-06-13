const asyncHandler = require("express-async-handler")
const validator = require("validator")
const Auth = require("../model/Auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    if (validator.isEmpty(name)) {
        return res.status(400).json({ message: "Name is required" })
    }
    if (validator.isEmpty(email)) {
        return res.status(400).json({ message: "please provide valid email" })
    }
    if (validator.isEmpty(password)) {
        return res.status(400).json({ message: "password is required" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "please provide strong password" })
    }
    //validation

    const result = await Auth.findOne({ email })

    if (result) {
        return res.status(400).json({ message: "email already register with us" })
    }

    const hashpass = await bcrypt.hash(password, 10)

    await Auth.create({ name, email, password: hashpass })

    res.status(201).json({ message: "User register success" })

})
exports.loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body


    if (validator.isEmpty(email)) {
        return res.status(400).json({ message: "please provide valid email" })
    }
    if (validator.isEmpty(password)) {
        return res.status(400).json({ message: "password is required" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "please provide strong password" })
    }
    //validation

    const result = await Auth.findOne({ email })

    if (!result) {
        return res.status(400).json({ message: "Invalid email" })
    }

    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(400).json({ message: "Invalid Password" })
    }

    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1h" })

    res.cookie("auth", token, { maxAge: 60 * 60 * 15 })
    res.status(200).json({
        message: "User login success",
        result: {
            name: result.name,
        }
    })



})
exports.logoutUser = asyncHandler(async (req, res) => {


    res.clearCookie("auth")
    res.status(200).json({ message: "User logout success" })


})