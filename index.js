const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleWare
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())




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

//JWT thisngs
app.post('/jwt', async(req,res) => {
   const user = req.body;
   const token = jwt.sign(user,process.env.TOKEN_SECRATE,{expiresIn: '1h'})
   res.cookie('token',token,{
    httpOnly:true,
    secure: true
   })
   .send({success : true})
   
})

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

app.get('/cart/:email', async (req, res) => {
  const email = req.params.email;
  const result = await cartCollection.find({ email: email }).toArray();
  res.send(result);
});

app.get('/cart/:email/:id', async (req, res) => {
  const email = req.params.email;
  const id = req.params.id;
  const query = { _id: new ObjectId(id), email: email };
  const result = await cartCollection.findOne(query);
  res.send(result);
});

app.delete('/cart/:email/:id', async (req, res) => {
  const email = req.params.email;
  const id = req.params.id;
  const query = { _id: new ObjectId(id), email: email };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
});



app.get('/', (req, res) => {
  res.send('Wellcome To Event Crafter Server')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})