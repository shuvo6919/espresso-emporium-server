//All Imports-------------------
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 5000;

//MidleWare------------------------------
app.use(cors());
app.use(express.json());
//MongoDb------------------------------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.j7egbu3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("EspressoEmporium");
    const coffeeColection = database.collection("CoffeeDB");

    //All CRUD Operations-------------------------------
    app.get("/", (req, res) => {
      res.send("Hello it is Espresso Coffee Server");
    });
    app.get("/coffee", async (req, res) => {
      const query = coffeeColection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      console.log(req.params.id);
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await coffeeColection.findOne(cursor);
      res.send(result);
    });
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const updatedInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedInfo.name,
          chef: updatedInfo.chef,
          supplier: updatedInfo.supplier,
          taste: updatedInfo.taste,
          category: updatedInfo.category,
          details: updatedInfo.details,
          photoUrl: updatedInfo.photoUrl,
          price: updatedInfo.price,
        },
      };
      const result = await coffeeColection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.post("/coffee", async (req, res) => {
      console.log(req.body);
      const newCoffee = req.body;
      const result = await coffeeColection.insertOne(newCoffee);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const cursor = { _id: new ObjectId(id) };
      const result = await coffeeColection.deleteOne(cursor);
      res.send(result);
    });

    //----------------------------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Espresso server is running on port : ${port}`);
});
