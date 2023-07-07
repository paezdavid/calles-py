const express = require("express");
const path = require("path")

const app = express()
const port = process.env.PORT || 3000;


app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const formRouter = require("./routes/formRouter")
app.use("/form", formRouter)
const indexRouter = require("./routes/indexRouter")
app.use("/", indexRouter)
const actualizarRouter = require("./routes/actualizarRouter")
app.use("/actualizar", actualizarRouter)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.get("/", (req, res) => {
    res.render("index")
})  

app.get("/form", (req, res) => {
    res.render("form")
})  

app.get("/actualizar", (req, res) => {
    res.render("actualizar")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})