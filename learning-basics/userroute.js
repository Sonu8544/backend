const express = require("express");
const { adminAuth, userAuth } = require("../src/middlewares/auth");

const app = express();

// app.get("/admin/user", (req, res) => {
//     console.log("Admin send data from server...");
//     console.log(req.params)
//     res.send("Admin send data from server...")
// })


// Handle all the middleware request for all the Auth request.
app.use("/admin", adminAuth)

// if 1 single route you can use auth like this below
app.get("/user", userAuth, (req, res) => {
    console.log("User data get from server !")
    res.send({ firstName: "Sonu", lastName: "kumar", userAuth })
})

app.get("/admin/user", (req, res) => {
    console.log("Admin send data from server...");
    res.send("Admind Authrised!")
})

app.delete("/admin/user", (req, res) => {
    console.log("delate data from db")
    res.send("delate user data from server!");
})

app.listen(7777, () => {
    console.log("server is successfully listen on port 7777...")
});