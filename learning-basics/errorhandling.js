const express = require("express");

const app = express();

app.get("/userdata", (req, res) => {
    try {
        throw new Error("dgewygd")
        res.send("User data")
    } catch (error) {
        res.status(500).send("Some thing went wront please connect support team!")
    }
})

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong!!")
    }
})

app.listen(7777, () => {
    console.log("server is successfully listen on port 7777...")
});