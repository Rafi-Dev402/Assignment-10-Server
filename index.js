require('dotenv').config()
const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;

/// Middleware----------->
app.use(cors())
app.use(express.json())


/// MongoDB---------------->
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

        /// Read Operation get all data-----------//
        app.get('/equipments', async (req, res) => {
            const cursor = equipmentDB.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        /// Read Operation Get eliment by id----//
        app.get('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) }
            const result = await equipmentDB.findOne(cursor)
            res.send(result)
        })

        //// Read operation get data by email
        app.get('/equipment/:email', async (req, res) => {
            const email = req.params.email;

            const query = { userEmail: email }
            const cursor = equipmentDB.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        /// UPDATE Operation------------->
        app.put('/equipment/update/:id',async(req,res)=>{
            const id = req.params.id;
            const updateData = req.body;
            console.log(id,updateData)
            
            const filter = {_id : new ObjectId(id)}
            const updateDocs = {
                $set:{
                    image : updateData.image,
                    itemName : updateData.itemName,
                    category : updateData.category,
                    price : updateData.price,
                    rating : updateData.rating,
                    stock : updateData.stock,
                    time : updateData.time,
                    customization : updateData.customization,
                    details : updateData.details                    

                }
            }
            const options = {upsert : true}
            const result = await equipmentDB.updateOne(filter,updateDocs,options)
            res.send(result)

        })

        /// Create Operation---------//
        app.post('/equipments', async (req, res) => {
            const equepmentData = req.body;
            // console.log(equepmentData)
            const result = await equipmentDB.insertOne(equepmentData);
            res.send(result)
        })

        /// Delete Operation----------?
        app.delete('/equipmentDel/:id',async(req,res)=>{
            const id = req.params.id;
            
            const query = {_id : new ObjectId(id)}
            const result = await equipmentDB.deleteOne(query)
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

