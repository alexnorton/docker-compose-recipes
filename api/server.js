var express = require('express'),
  bodyParser = require('body-parser'),
  mongodb = require('mongodb');

var app = express();

app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect('mongodb://localhost:27017/ocp-compose-demo', function(err, conn) {
  if (err) {
    throw err;
  }
  db = conn.collection('recipes');
});

app.get('/', function(req, res) {
  res.send('Welcome to the Alex\'s Recipes API');
});

app.get('/recipes', function(req, res) {
  db.find().toArray(function(err, result) {
    if(err) {
      return res.status(500).send({ "error": err });
    }
    res.send(result);
  });
});

app.post('/recipes', function(req, res) {
  db.insertOne(req.body, function(err, result) {
    if(err) {
      return res.status(500).send({ "error": err });
    }
    res.send({
      "result": "success",
      "_id": result.insertedId
    });
  })
});

app.get('/recipes/:id', function(req, res) {
  try {
    db.findOne(mongodb.ObjectId(req.params.id), function(err, doc) {
      if(doc) {
        res.send(doc);
      } else {
        res.status(404).send({ error: "Recipe not found" });
      }
    });
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
});

app.listen(3000);
