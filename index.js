const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000


//Middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j998cjx.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const productsCollection = client.db('productDB').collection('products')
    const cartItems = client.db('productDB').collection('cart')


    // post to mongoDb
    app.post('/products', async (req, res) => {
      const newproducts = req.body;
      console.log(newproducts);
      const result = await productsCollection.insertOne(newproducts)
      res.send(result)
    })

    // get from mongoDb
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })



    app.post('/cart', async (req, res) => {
      const newcart = req.body;
      console.log(newcart);
      const output = await cartItems.insertOne(newcart)
      res.send(output)
    })

    // get from mongoDb
    app.get('/cart', async (req, res) => {
      const cursor = cartItems.find()
      const output = await cursor.toArray()
      res.send(output)
    })


    //fetching data for UPDATE
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result)
    })
    //Update data
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedProduct = req.body;
      const newupdatedProduct = {
        $set: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          price: updatedProduct.price,
          shortD: updatedProduct.shortD,
          rating: updatedProduct.rating,
          image: updatedProduct.image
        }
      }
      const result = await productsCollection.updateOne(filter, newupdatedProduct, options)
      res.send(result)
    })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('products server is running')
})
app.listen(port, () => {
  console.log('server is running at:', port);
})