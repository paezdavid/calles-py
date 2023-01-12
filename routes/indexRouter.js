const express = require("express")
const router = express.Router()
const dotenv = require('dotenv').config();


router.get("/", (req, res) => {
    const { MongoClient, ServerApiVersion } = require('mongodb');

    
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8jwuy6u.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(async err => {
        const bachesColl = await client.db(process.env.DB_NAME).collection(process.env.COLL_NAME);
        
        // INSERT EVERYTHING TO COLLECTION
        const baches_docs = await bachesColl.find()
        
        const baches_json = {
            arr_of_baches: []
        }

        for await (const bache of baches_docs) {
            baches_json.arr_of_baches.push(bache)
        }
    
    
        console.log(baches_json)
        
        client.close();
        console.log("Done!")
        res.render("index", { baches: baches_json })
    });


})





module.exports = router