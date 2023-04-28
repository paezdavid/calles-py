const express = require("express")
const router = express.Router()
const dotenv = require('dotenv').config();


router.get("/", async (req, res) => {
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8jwuy6u.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect() 

    const bachesColl = await client.db(process.env.DB_NAME).collection(process.env.COLL_NAME);

    // GET THE COUNT OF EACH CATEGORY
    let veredasCount = await bachesColl.countDocuments({ street_category: "vereda_mal_estado" })
    let aguaPerdidaCount = await bachesColl.countDocuments({ street_category: "perdida_de_agua" })
    let basuralesCount = await bachesColl.countDocuments({ street_category: "basural" })
    let bachesCount = await bachesColl.countDocuments({ street_category: "bache" })

    client.close();

    console.log("Done loaded index!")

    // SEND THE DATA TO THE CLIENT
    res.render("index", { veredasCount: veredasCount, aguaPerdidaCount: aguaPerdidaCount, basuralesCount: basuralesCount, bachesCount: bachesCount })
})

module.exports = router