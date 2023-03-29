const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// is the connection string for the MongoDB database. We're assuming that there is a MongoDB container 
// running with the name mongodb-container and listening on port 27017.
const url = 'mongodb://mongodb-container:27017/formulaire-db';
const dbName = 'mydb'; //is the name of the database we want to use.

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB server:', err);
    process.exit(1);
  }

  console.log('Connected successfully to MongoDB server');
  const db = client.db(dbName); // get a reference to the database instance.

  app.locals.db = db; // make the database instance available to the app 
  // We add the database instance to the app's locals object so that it can be accessed by the routes.
  app.listen(port, () => {
    console.log(`Form server listening at http://localhost:${port}`);
  });
});

app.use(express.urlencoded({ extended: true }));

// sends back an HTML form that the user can fill out.
app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/submit">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name"><br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email"><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/submit', (req, res) => {
  // We extract the name and email fields from the request body using destructuring.
  const { name, email } = req.body;
  //We get a reference to the database instance from the app's locals object.
  const { db } = req.app.locals;
  //We get a reference to the submissions collection in the database and insert a new document with the name and email fields.
  
  const collection = db.collection('submissions'); // hadi is : "submissions" est le nom d'une collection MongoDB qui stocke les documents soumis via un formulaire.
  // // inserting a new document into the MongoDB database:
  collection.insertOne({ name, email }, (err) => {
    if (err) {
      console.error('Failed to insert submission:', err);
      res.status(500).send('Failed to submit form');
    } else {
      console.log('Form submitted:', { name, email });
      res.send('Form submitted!');
    }
  });
});

