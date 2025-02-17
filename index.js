require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;

/// Middleware----------->
app.use(cors())
app.use(express.json())


/// MongoDB---------------->
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.wsg3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MDB_USERPASS}@cluster0.wsg3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        //// OPERATIONS------------------>
        const equipmentDB = client.db("equipmentCollection").collection("equipments"); 


        // create Operation---------//
        app.post('/equipments',async(req,res)=>{
            const equepmentData = req.body;
            // console.log(equepmentData)
            const result = await equipmentDB.insertOne(equepmentData);
            res.send(result)
        })







        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send("This Server is for A Sports Equipment online Store")
})

app.listen(port, () => {
    console.log(`My server in now running in ${port}`)
})

