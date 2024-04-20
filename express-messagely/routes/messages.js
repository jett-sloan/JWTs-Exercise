const express = require("express");

const message = require("/home/jettsloan/css/express-messagely/models/message");
const user = require("/home/jettsloan/css/express-messagely/models/user");
const { json } = require("body-parser");

const router = new express.Router();
/** GET /:id - get detail of message.
 * 
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureLoggedIn, async function(req,res,next){
let id = req.params
message.get(id)
return json({message})

})


router.post("/", async function(req,res,next){
    const { to_username, body } = req.body;

    // Get the username of the sender from the request
    const from_username = req.user.username; // Assuming you have implemented user authentication

    // Create a new message using the Message model
    const newMessage = await message.create({ from_username, to_username, body });

    // Respond with the details of the newly created message
    return res.json({ message: newMessage });
})
/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/id:/read", async function(req,res,next){
    let id = req.params.id
    const username = req.user.username;
    const message = await message.get(id);
    if (message.to_user.username !== username) {
        return res.status(403).json({ error: "You are not authorized to mark this message as read" });
    }
    const markedMessage = await message.markRead(id);

    // Respond with the details of the marked message
    return res.json({ message: markedMessage });
})
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

module.exports = router;