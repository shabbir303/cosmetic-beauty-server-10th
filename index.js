const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zm5ln60.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zm5ln60.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


// const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_SECURITY_KEY}@doctorsportaldb.emopfua.mongodb.net/?retryWrites=true&w=majority`;
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

    const cosmeticCollection = client.db("userDB").collection("beauties");
    // const cartCollection = client.db("userDB").collection("carts");

    app.get('/beauties', async (req, res) => {
      const cursor = cosmeticCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/beauties/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cosmeticCollection.findOne(query);
      res.send(result);
    })

    app.put('/beauties/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProducts = req.body;
      const products = {
        $set: {
          image: updatedProducts.image,
          name: updatedProducts.name,
          brand: updatedProducts.brand,
          type: updatedProducts.type,
          price: updatedProducts.price,
          describe: updatedProducts.describe,
          rating: updatedProducts.rating
        }
      }
      const result = await cosmeticCollection.updateOne(filter,products, options, );
      res.send(result);
    })

    app.post('/beauties', async (req, res) => {
      const addProduct = req.body;
      console.log(addProduct);
      const result = await cosmeticCollection.insertOne(addProduct);
      res.send(result);
    })


    // cart
    const cartCollection = client.db("userDB").collection("carts");
    app.get('/cart', async (req, res) => {
      const email = req.query.email;
     
      const query = { email: email };
      console.log(query, req.query);
      const carts = await cartCollection.find(query).toArray();
      res.send(carts);
    })

    app.post('/cart', async (req, res) => {

      try {
        const cardItemData = req.body;
        console.log(cardItemData);
        const newCardItem = await cartCollection.insertOne(cardItemData)
        res.send(newCardItem)

      }
      catch (error) {
        res.send(error);
      }
    });

    // user Apis
    // const userCollection = client.db('userDB').collection("users");
    // app.post('/user', async (req, res) => {
    //   const user  = req.body;
    //   const result =await userCollection.isertOne(user.email);
    //   res.send(result);
    // })
    



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
  res.send('My server is running')
});

app.listen(port, () => {
  console.log(`My server is running on port: ${port}`);
})

