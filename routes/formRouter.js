const express = require("express")
const router = express.Router()
const multer  = require('multer')
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv').config();


const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY, {
  global: { fetch: fetch.bind(globalThis) }
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits: { fileSize: 2000000 } })

router.post('/', upload.single('image'), async (req, res) => {
    const imgFile = Buffer.from(req.file.buffer, 'utf-8')
    const uploadTime = Date.now()

    // UPLOAD IMAGE TO SUPABASE
    const { data, error } = await supabase
        .storage
        .from('calles-paraguay')
        .upload(`public/${uploadTime}.jpg`, imgFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
    })
    
    console.log("Image uploaded to cloud storage! :)")

    // GET URL OF UPLOADED IMAGE
    const data1 = await supabase
    .storage
    .from('calles-paraguay')
    .getPublicUrl(`public/${uploadTime}.jpg`)

    
    // Lat and long come from the front as a string separated by a space. 
    // We extract those two values and put them into an array
    const arrOfCoords = req.body.user_coords.split(" ")


    // INITIALIZE DB
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8jwuy6u.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(async err => {
    const bachesColl = await client.db(process.env.DB_NAME).collection(process.env.COLL_NAME);
    
        // INSERT EVERYTHING TO COLLECTION
        await bachesColl.insertOne({
            street_category: req.body.category,
            image_url: data1.data.publicUrl,
            street_coords: {
                lat: arrOfCoords[0],
                lng: arrOfCoords[1]
            },
            opt_address: req.body.opt_address,
            opt_user_comment: req.body.opt_user_comment
        })

        console.log("Document added to db! :)")


        client.close();
        console.log("Done!")
    });


    
    res.redirect("/")
})


module.exports = router