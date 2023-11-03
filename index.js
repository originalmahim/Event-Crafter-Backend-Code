const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleWare
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqvmyxo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const services = client.db('eventFile').collection('eventCollection')
const cartCollection = client.db('booFile').collection('booCollection')

app.get('/services' , async(req,res) => {
    const result = await services.find().toArray()
    res.send(result)
})

app.get('/services/:id' , async(req,res) => {
   const id = req.params.id;
   const qurary = {_id : new ObjectId(id)};
   const result = await services.findOne(qurary);
   res.send(result)
} )

app.post('/cart', async(req,res) => {
    const cart = req.body;
    const result = await cartCollection.insertOne(cart)
    res.send(result)
})

app.get('/cart', async (req,res) => {
    const result = await cartCollection.find().toArray()
    res.send(result)
})



app.get('/', (req, res) => {
  res.send('Wellcome To Event Crafter Server')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})