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

    // service api
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
    app.get('/service/:title', (req, res) => {
        serviceCollection.find({ title: req.params.title })
            .toArray((error, documents) => {
                res.send(documents)
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
    // find admin or not
    app.post('/admin', (req, res) => {
        const email = req.body.email
        adminCollection.find({ email: email })
            .toArray((err, data) => {
                res.send(data.length > 0)
            })
    })
    // order api
    const orderCollection = client.db("theCarDoctor").collection("orders");
    // add new order
    app.post('/addOrder', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    // all orders
    app.get('/allOrders', (req, res) => {
        orderCollection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
    // individual orders
    app.post('/orders', (req, res) => {
        const email = req.body.email
        orderCollection.find({ email: email })
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
    //update order status 
    app.patch('/update/:id', (req, res) => {
        const toUpdate = req.body;
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            { $set: toUpdate, $currentDate: { lastModified: true } })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
            .catch(err => {
                console.log('Failed to update');
            })
    })
    // review api
    const reviewCollection = client.db("theCarDoctor").collection("reviews");
    app.post('/addReview', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
});

const port = 4000;
app.listen(process.env.PORT || port);