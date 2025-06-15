const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnecctionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/users');

const requestRouter = express.Router();

// get email function
const sendEmail = require("../utils/sendEmail");

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

        // Send email notification
        const emailResponse = await sendEmail.run(
           `Hello ${toUser.firstName} you got new Request from ${req.user.firstName}`,
           `<h1>Hello ${toUser.firstName},</h1>
            <p>${req.user.firstName} has sent you a connection request with the status: ${status}.</p>
            <p>Please log in to your account to review the request.</p>`,
        );
        console.log("Email sent successfully:", emailResponse);


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

// create api for accept and reject connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res, next) => {
    try {
        const loggedinUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];

        // validate the status
        if (!allowedStatus.includes(status)) {
            return res.status(400).json("Invalid status type: " + status);
        }

        const connectionRequest = await ConnecctionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedinUser._id,
            status: "interested",
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found..." });
        }

        // Update the status of the connection request
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            success: true,
            message: loggedinUser.firstName + " " + status + " the connection request",
            data: data,
        });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }

})

module.exports = requestRouter;