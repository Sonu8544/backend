const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnecctionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/users');

const USER_SAFE_DATA = "firstName lastName photoUrl about skills age";

// get all pending requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const ConnecctionRequest = await ConnecctionRequestModel.find({
            toUserId: loggedinUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        if (!ConnecctionRequest) {
            return res.status(404).send("No connection requests found");
        }

        res.json({
            status: true,
            message: "Connection requests fetched successfully",
            data: ConnecctionRequest
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }
})

// get all accepted requests
userRouter.get("/user/requests/accepted", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const ConnectionRequest = await ConnecctionRequestModel.find({
            $or: [
                { fromUserId: loggedinUser._id, status: "accepted" },
                { toUserId: loggedinUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const data = ConnectionRequest.map((data) => (
            data.fromUserId._id.equals(loggedinUser._id) ? data.toUserId : data.fromUserId
        ))

        // const data = ConnectionRequest.map((data) => {
        //     if (data.fromUserId._id.equals(loggedinUser._id)) {
        //         return data.toUserId;
        //     } else {
        //         return data.fromUserId;
        //     }
        // })
        if (!ConnectionRequest) {
            return res.status(404).send("No connection requests found");
        }
        res.json({
            status: true,
            message: "Connection requests fetched successfully",
            data: data
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }
})

// get all accepted requests new connection API
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const ConnectionRequest = await ConnecctionRequestModel.find({
            $or: [
                { fromUserId: loggedinUser._id, status: "accepted" },
                { toUserId: loggedinUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const data = ConnectionRequest.map((data) => (
            data.fromUserId._id.equals(loggedinUser._id) ? data.toUserId : data.fromUserId
        ))

        // const data = ConnectionRequest.map((data) => {
        //     if (data.fromUserId._id.equals(loggedinUser._id)) {
        //         return data.toUserId;
        //     } else {
        //         return data.fromUserId;
        //     }
        // })
        if (!ConnectionRequest) {
            return res.status(404).send("No connection requests found");
        }
        res.json({
            status: true,
            message: "Connection requests fetched successfully",
            data: data
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }
})


// get user feed cards

// User should see all the card except this
// 00. His own card
// 01. his ingored prople
// 02. his connections
// 03. already send connection request

// "/feed?page=1&limit=10"
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 30 ? 30 : limit
        const skip = (page - 1) * limit;

        const ConnecctionRequest = await ConnecctionRequestModel.find({
            $or: [
                { fromUserId: loggedinUser._id }, { toUserId: loggedinUser._id }
            ]
        }).select("fromUserId toUserId")

        // Use set for valid user feed
        const hideUserFromFeed = new Set();
        ConnecctionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await UserModel.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedinUser._id } }
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        
        res.json({
            status: true,
            message: "User fetch his feed card",
            data: users
        });

    } catch (error) {
        res.status(404).send("Message : " + error.message)
    }
})

module.exports = userRouter;