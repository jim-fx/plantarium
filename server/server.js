const express = require("express");
const helmet = require("helmet")
const slow = require("express-slow-down");
const validators = require("./validators")

const app = express();

app.use(helmet());
app.enable("trust proxy");
app.use(slow())


app.post("/plantDescription/:id", validators.id, (req, res) => {
    res.json({
        test: true,
        id: req.params.id
    })
});

app.delete("/plantDescription/:id", validators.id, (req, res) => {

});

app.put("/plantDescription", (req, res) => {

});

app.get("/plantDescription/:id", validators.id, (req, res) => {

});


app.post("/settings", validators.id, (req, res) => {

});

app.delete("/settings", validators.id, (req, res) => {

});

app.put("/settings", validators.id, (req, res) => {

});

app.get("/settings", validators.id, (req, res) => {

});

app.get("/", (req, res) => {
    res.send("<a href='https://jim-fx.github.io/plantarium'>Visit the app</a>");
})

const server = app.listen(process.env.PORT || 3000, (...args) => {
    console.log(`Server ist listening on: ${server.address().port}`)
})