const express = require('express');
const { userAuth } = require('../middlewares/auth');


const requestRouter = express.Router();

// Connection request api
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res, next) => {
    try {
        const user = req.user;
        console.log("sending connection request...");
        console.log("user: ", user);
        res.send(user.firstName + "sent connection request!");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = requestRouter;