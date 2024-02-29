const express = require('express');
const redis = require('redis');
const connectToMongo = require('./db'); 

const app = express();
app.use(express.json());

// Create Redis client
const redisClient = redis.createClient({
    socket: {
      host: 'redis',
      port: 6379
    }
  });

  // Connect to Redis
async function connectToRedis() {
    await redisClient.connect();
  }
  
connectToRedis().then(() => {
    console.log('Connected to Redis');
  }).catch(err => {
    console.error('Redis connection error:', err);
});

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

app.post('/add-to-redis', async (req, res) => {
    const { key, value } = req.body;
    try {
        // Use the set command as per the new Redis client API
        await redisClient.set(key, JSON.stringify(value), {
            EX: 3600,
        });
        res.status(200).send('Data added to Redis successfully.');
    } catch (err) {
        console.error('Error adding data to Redis:', err);
        res.status(500).send('Error adding data to Redis.');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});