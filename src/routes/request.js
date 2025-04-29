const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnecctionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/users');

const requestRouter = express.Router();

// Connection request api
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status type: " + status);
        }

        // Check if the connection request already exists
        const existingRequest = await ConnecctionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingRequest) {
            return res.status(400).send({ message: "Connection request already exists..." });
        }

        const toUser = await UserModel.findById(toUserId);
        if (!toUser) {
            return res.status(400).send("User not found...");
        }

        const connectionRequest = await ConnecctionRequestModel.create({
            fromUserId,
            toUserId,
            status,
        })

        const connectionRequestData = await connectionRequest.save();
        if (!connectionRequestData) {
            return res.status(400).send("Connection request failed...");
        } else {
            res.json({
                success: true,
                message: req.user.firstName + " " + status + " to " + toUser.firstName,
                data: connectionRequestData,
            });
        }

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = requestRouter;