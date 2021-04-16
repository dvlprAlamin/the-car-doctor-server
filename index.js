const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsgsy.mongodb.net/theCarDoctor?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("theCarDoctor").collection("services");
    app.post('/addService', (req, res) => {
        serviceCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
    app.delete('/delete/:id', (req, res) => {
        serviceCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
            .then(response => {
                res.send(response.ok > 0);
            })
    })
    // add admin api
    const adminCollection = client.db("theCarDoctor").collection("admin");
    app.post('/addAdmin', (req, res) => {
        adminCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //   app.get('/juices/:id', (req, res) => {
    //     juiceCollection.find({ _id: ObjectId(req.params.id) })
    //       .toArray((error, documents) => {
    //         res.send(documents)
    //       })
    //   })

    //   const orderCollection = client.db("juicerBoosters").collection("orders");
    //   app.post('/order', (req, res) => {
    //     console.log(req.body);
    //     const orderData = req.body;
    //     orderCollection.insertOne(orderData)
    //       .then(result => {
    //         res.send(result.insertedCount > 0);
    //       })
    //   })
    //   app.get('/orders', (req, res) => {
    //     orderCollection.find(req.query)
    //       .toArray((err, documents) => {
    //         res.send(documents)
    //       })
    //   })
    //   const adminCollection = client.db("juicerBoosters").collection("admins");
    //   app.post('/admin', (req, res) => {
    //     // console.log(req.body.email);
    //     const email = req.body.email
    //     adminCollection.find({ email: email })
    //       .toArray((err, data) => {
    //         console.log(data);
    //         res.send(data.length > 0)
    //       })
    //   })
});

const port = 4000;
app.listen(process.env.PORT || port);