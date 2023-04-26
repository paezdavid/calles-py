const express = require("express")
const router = express.Router()
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();
const { body } = require('express-validator');




router.post('/', 
    body("category").trim().escape(), // we trim and escape all the user input coming from the client.
    body("publicUrl").trim().escape(), 
    body("opt_address").trim().escape(),
    body("opt_user_comment").trim().escape(),
    async (req, res) => {

    try {
        const uploadTime = Date.now()

        // Lat and long come from the front as a string separated by a space. 
        // We extract those two values and put them into an array
        const arrOfCoords = req.body.user_coords.split(" ")
    
        // INITIALIZE DB
        const uri = `mongodb://127.0.0.1:27017/`;
        const client = new MongoClient(uri);
        await client.connect()
        
        
        const bachesColl = await client.db("calles_py").collection("data");

        // If user input contains a "$", don't save the document and go back to the index.
        // A "$" is used to perform NoSQL injection.
        if (`${req.body.category} ${req.body.opt_address} ${req.body.opt_user_comment} ${arrOfCoords[0]} ${arrOfCoords[1]}`.includes("$")) {
            console.error("User input contains a '$'. The document was not saved.")
            res.redirect("/")
            return
        } else {
            // INSERT EVERYTHING TO COLLECTION
            const insertedDoc = await bachesColl.insertOne({
                street_category: req.body.category,
                street_coords: {
                    lat: arrOfCoords[0],
                    lng: arrOfCoords[1]
                },
                opt_address: req.body.opt_address,
                opt_user_comment: req.body.opt_user_comment,
                upload_date: uploadTime
            })
    
            console.log("Document added to db! :)")
    
    
            client.close();
            console.log("Doneeeeeeeeeee form router!")
        }
        res.redirect("/")
    
    
        
    } catch (error) {
        console.error(error)
    }

})


module.exports = router