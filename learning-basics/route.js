const express = require("express")

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from the server :)")
})

// app.get("/user", (req, res) =>{
//     res.send({firstName: "Sonu", lastName: "Kumar"})
// })

// red query params in url    
app.get("/user", (req, res) => {
    console.log(req.query)
    res.send({ firstName: "Sonuu singh...", lastName: "Kumar" })
})

// How to get dynamic route like /user/123   http://localhost:7777/user/123
app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({ name: "Ashok singh", home: "Begusarai" })
})

// Multiple user paramiters how to get hare
app.get("/user/:name/:id/:password", (req, res) => {
    console.log(req.params)
    res.send({ name: "multiple user information using paramiters", home: "Begusarai" })

})

app.post("/user", (req, res) => {
    // data save to the DB
    res.send("Successfully data save in Data Base")
})

app.delete("/user", (req, res) => {
    // Delete user from data base
    res.send("Successfully delete user from database...")
})

// B is optional route 
app.get("/ab?c", (req, res) => {
    res.send({ firstName: "Sony", lastName: "Singh" })
})

// a and c is mandotry and you can add my more like abbbbbbc that workes
app.get("/ab+c", (req, res) => {
    res.send({ firstName: "Ssatyam", lastName: "Singh" })
})

// ab is mandotry and you can add any thing position of star * and last cd id mandotry
app.get("/ab*cd", (req, res) => {
    res.send({ firstName: "Ssatyam", lastName: "Singh" })
})

// bc is optional 
app.get("/a(bc)?dd", (req, res) => {
    res.send({ firstName: "Ssssssssatyam", lastName: "Singh" })
})

// resurch in google    
app.get("/a(bc)+d", (req, res) => {
    res.send({ firstName: "Ssssdddddsatyam", lastName: "Singh" })
})

// if regax is match on url this shoulfd work   
app.get(/a/, (req, res) => {
    res.send({ firstName: "Rejex", lastName: "Singh" })
})

// if fly match on url this shoulfd work  http://localhost:7777/dheiufhefly  
app.get(/.*fly$/, (req, res) => {
    res.send({ firstName: "complax rejax", lastName: "Singh" })
})

app.listen(7777, () => {
    console.log("server is successfully listen on port 7777...")
});