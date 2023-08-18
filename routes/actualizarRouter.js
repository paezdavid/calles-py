const express = require("express")
const router = express.Router()
const dotenv = require('dotenv').config();


router.get("/:id", async (req, res) => {
    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8jwuy6u.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect() 
    const bachesColl = await client.db(process.env.DB_NAME).collection(process.env.COLL_NAME);

    const thisStreet = await bachesColl.findOne(ObjectId(req.params.id))

    res.render("actualizar", { thisStreet: thisStreet })
})

router.post("/:id", async (req, res) => {
    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8jwuy6u.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect() 
    const bachesColl = await client.db(process.env.DB_NAME).collection(process.env.COLL_NAME);

    const thisStreet = await bachesColl.updateOne({ _id: ObjectId(req.params.id) }, {
        $set: { "street_status": { "broken": req.body.arreglo === "calle_fue_arreglada" ? false : true, "fixed_by": req.body.quien } }
    })

    res.redirect("/")
})

module.exports = router