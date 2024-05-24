const express = require('express');
const redis = require('redis');
const connectToMongo = require('./db'); 

const app = express();
app.use(express.json());



// Middleware to ensure MongoDB connection is ready
async function mongoMiddleware(req, res, next) {
  try {
    req.db = await connectToMongo;
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).send('Error connecting to MongoDB.');
  }
}

// Use the middleware on routes that require MongoDB
app.post('/add-to-mongo', mongoMiddleware, async (req, res) => {
  const { collectionName, document } = req.body;
  const collection = req.db.collection(collectionName);
  try {
    await collection.insertOne(document);
    res.status(200).send('Document added to MongoDB successfully.');
  } catch (error) {
    console.error('Error adding document to MongoDB:', error);
    res.status(500).send('Error adding document to MongoDB.');
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});