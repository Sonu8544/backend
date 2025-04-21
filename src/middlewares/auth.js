const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");

// User Auth
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Unauthorized: Token Not Valid!!!!.");
        }
        const decodedToken = await jwt.verify(token, "devTinder@123");

        const { _id } = decodedToken;
        const user = await UserModel.findById(_id);
        if (!user) {
            throw new Error("User not found in database.");
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(500).send("Error in user auth: " + error.message);
    }
}

module.exports = {
    userAuth,
}