const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://organicUser:rabbi@cluster0-shard-00-00.zkchj.mongodb.net:27017,cluster0-shard-00-01.zkchj.mongodb.net:27017,cluster0-shard-00-02.zkchj.mongodb.net:27017/organicdb?ssl=true&replicaSet=atlas-hngkk3-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const productCollection = client.db("organicdb").collection("products");


  app.get('/products',(req, res)=>{
    productCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents)=>{
      res.send(documents[0]);
    })
  })

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    //console.log(product);
    productCollection.insertOne(product)
    .then(result=>{
      console.log('data added successfully');
      //res.send('success');
      res.redirect('/')
    })
  })
  // product= { name: "dim", price: 10, quantity: 50};
  // collection.insertOne(product)
  // .then(result=>{
  //   console.log("one product added");
  // })

  app.patch('/update/:id',(req, res)=>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result=>{
      //console.log(result)
      res.send(result.modifiedCount>0)
    })
  })

  app.delete('/delete/:id', (req,res)=>{
    //console.log(req.params.id);
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      //console.log(result);
      res.send(result.deletedCount>0);
    })
  })


});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})




app.listen(3000);