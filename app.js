const express = require("express");
const path = require("path")

const app = express()
const port = process.env.PORT || 8000;


app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const formRouter = require("./routes/formRouter")
app.use("/form", formRouter)
const indexRouter = require("./routes/indexRouter")
app.use("/", indexRouter)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.get("/", (req, res) => {
    res.render("index")
})  

app.get("/form", (req, res) => {
    res.render("form")
})  

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})