const express = require("express")
const router = express.Router()
const dotenv = require('dotenv').config();

const { MongoClient } = require('mongodb');
const uri = `mongodb://127.0.0.1:27017/`;
const client = new MongoClient(uri);

router.get("/", async (req, res) => {

    await client.connect()

    const bachesColl = await client.db("calles_py").collection("data");

    let veredasCount = await bachesColl.countDocuments({ street_category: "vereda_mal_estado" })
    let aguaPerdidaCount = await bachesColl.countDocuments({ street_category: "perdida_de_agua" })
    let basuralesCount = await bachesColl.countDocuments({ street_category: "basural" })
    let bachesCount = await bachesColl.countDocuments({ street_category: "bache" })
    
    // GET ALL DOCUMENTS INSIDE DB
    const baches_docs = await bachesColl.find()
    
    // PUT THEM IN AN OBJECT
    const baches_obj = {
        arr_of_baches: []
    }

    // INSERT THE DATA EXTRACTED FROM DB INTO THE OBJECT 
    for await (const bache of baches_docs) {
        baches_obj.arr_of_baches.push(bache)
    }

    client.close();
    console.log("Done loaded index!")

    // SEND THE DATA TO THE CLIENT
    res.render("index", { baches: baches_obj, veredasCount: veredasCount, aguaPerdidaCount: aguaPerdidaCount, basuralesCount: basuralesCount, bachesCount: bachesCount })


})





module.exports = router