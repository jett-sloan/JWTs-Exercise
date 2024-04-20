const express = require("express");

const message = require("/home/jettsloan/css/express-messagely/models/message");

const user = require("/home/jettsloan/css/express-messagely/models/user");
const bcrypt = require("bcryptjs")
const router = new express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.post("/login", async function(req, res, next){
    const {username, password } = req.body
    const userToFind = user.get(username)
    if(!userToFind){
        return res.status(401).json({message:"authenication failed"})
    }
    const ismatched = await bcrypt.compare(password,userToFind.password)
    if(!ismatched){
        return res.status(401).json({message:"authenication failed"})
    }
    try {
        await user.updateLoginTimestamp(username);
    } catch (error) {
        console.error("Error updating last login timestamp:", error);
        // Handle error, possibly by returning a 500 status code
        return res.status(500).json({ message: "Internal server error" });
    }

    let token = jwt.sign({ username }, SECRET_KEY);

    return res.json({ token });

})


router.post("/register", async function(req,res,next){
    const { username, password, first_name, last_name, phone } = req.body;

    const existingUser = await user.findByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await user.register(username, hashedPassword, first_name, last_name, phone);
    await newUser.updateLoginTimestamp(username);
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
})

module.exports = router;