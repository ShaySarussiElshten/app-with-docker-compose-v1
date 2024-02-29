const mongodb = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://db:27017';

const connectToMongo = mongodb.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => client.db('mydatabase'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

module.exports = connectToMongo;