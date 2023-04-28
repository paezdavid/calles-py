const express = require("express")
const router = express.Router()
const multer  = require('multer')
const sharp = require("sharp")
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv').config();
const { body } = require('express-validator');


const { createClient } = require("@supabase/supabase-js");
const { MulterError } = require("multer");

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY, {
  global: { fetch: fetch.bind(globalThis) }
})

const storage = multer.memoryStorage()
// Only png, jpeg and jpg formats are allowed. 
const upload = multer({ storage: storage, fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
} })


router.post('/', 
    upload.single('image'), 
    body("category").trim().escape(), // we trim and escape all the user input coming from the client.
    body("publicUrl").trim().escape(), 
    body("opt_address").trim().escape(),
    body("opt_user_comment").trim().escape(),
    async (req, res) => {

    try {
        const uploadTime = Date.now()
    
        const uploadResizedImg = await sharp(req.file.buffer).resize(1024, 768, { fit: 'cover' }).toFormat('jpg').toBuffer().then(async resized_img => {
            
            // UPLOAD IMAGE TO SUPABASE
            const { data, error } = await supabase
                .storage
                .from('calles-paraguay')
                .upload(`public/${uploadTime}.jpg`, resized_img, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/jpeg'
            })
            
            console.log("Image uploaded to cloud storage! :)")
        })
    
        // GET URL OF UPLOADED IMAGE
        const imageData = await supabase
        .storage
        .from('calles-paraguay')
        .getPublicUrl(`public/${uploadTime}.jpg`)
        
        // Lat and long come from the front as a string separated by a space. 
        // We extract those two values and put them into an array
        const arrOfCoords = req.body.user_coords.split(" ")
    
        // INITIALIZE DB
        const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8jwuy6u.mongodb.net/?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        client.connect()
        
        const bachesColl = await client.db(process.env.DB_NAME).collection(process.env.COLL_NAME);

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
                image_url: imageData.data.publicUrl,
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