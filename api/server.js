var express = require('express'),
  bodyParser = require('body-parser'),
  mongodb = require('mongodb');

var app = express();

app.use(bodyParser.json());

var db;

var dbUrl = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/ocp-compose-demo';

mongodb.MongoClient.connect(dbUrl, function(err, conn) {
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

app.post('/recipes/:id', function(req, res) {
  try {
    var recipe = req.body;
    delete recipe._id;
    db.updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: recipe }, function(err) {
      if(err) {
        return res.status(500).send({ "error": err });
      }
      res.status(204);
    });
  } catch(e) {
    res.status(500).send({ "error": e.message });
  }
});

app.delete('/recipes/:id', function(req, res) {
  try {
    db.deleteOne({ _id: mongodb.ObjectId(req.params.id) }, null, function(err) {
      if(err) {
        return res.status(500).send({ "error": err });
      }
      res.status(204);
    });
  } catch(e) {
    res.status(500).send({ "error": e.message });
  }
});

app.listen(3000);
