const express = require("express");

const message = require("/home/jettsloan/css/express-messagely/models/message");

const user = require("/home/jettsloan/css/express-messagely/models/user");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const router = new express.Router();
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", ensureLoggedIn, async function(req,res,next){
    let users = await user.all();
    return res.json({users});
})

router.get("/:username", ensureLoggedIn, async function (req,res,next){
    let username = req.params.username
    let User = await user.get(username)
    return res.json({User});
})
/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username/to", ensureLoggedIn, async function (req,res,next){
    let username = req.params.username
    let messages = await user.messagesTo(username);
    return res.json({messages});
})
/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureLoggedIn, async function(req,res,next){
    let username = req.params.username
    let messages = await user.messagesFrom(username);
    return res.json({messages});
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
module.exports = router;