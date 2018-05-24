const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/eatTheFrog'

const ObjectID = require('mongodb').ObjectID

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())


// MongoDB connection
// MongoClient.connect(url, function(err, client){
//     console.log('Connected to mongoDb, lol')
//     let db = client.db('eatTheFrog')
    // addData(db)
    // insertIntoDB(db)
    // getDataFromDB(db)
    // updateDataFromDB(db)
    // removeDataFromDB(db)
    // db.close()
// })

// MongoDB get route
app.get('/tasks', function(req, res) {

    MongoClient.connect(url, function (err, client) {
        console.log('Connected to mongoDb, lol')
        let db = client.db('eatTheFrog')
        getDataFromDB(db)
    })

    var getDataFromDB = function (db) {
        var collection = db.collection('eatTheFrog')
        collection.find({}).toArray(function (err, docs) {
            res.json(docs)
        })
    }
})

// MongoDB insert into query
app.post('/task', function (req, res){

    MongoClient.connect(url, function (err, client) {
        console.log('Connected to mongoDb, lol')
        let db = client.db('eatTheFrog')
        insertIntoDB(db)
    })

    var insertIntoDB = function(db) {
        db.collection('eatTheFrog').insertOne(req.body , function(err, result){
            console.log("inserted")
            res.json(result)
        })
    }
})

// MongoDB update data query
app.put('/task', function (req, res) {

    var updateDataFromDB = function (db, id, description, date, done) {
        var collection = db.collection('eatTheFrog')
        collection.updateOne({_id: ObjectID(id)}
            , {
                $set:
                    {
                        description: description,
                        due: date,
                        completed: done,
                    }
            },
            function (err, result) {
                res.json(result)
            })
    }

    let id = req.body.id
    let newItem = req.body.description
    let newDueDate = req.body.due
    let completedFlag = req.body.completed

    MongoClient.connect(url, function (err, client) {
        console.log('Connected to mongoDb, lol')
        let db = client.db('eatTheFrog')
        updateDataFromDB(db, id, newItem, newDueDate, completedFlag)
    })
})

// MongoDB remove data query
app.delete('/task', function (req, res){

    MongoClient.connect(url, function (err, client) {
        console.log('Connected to mongoDb, lol')
        let db = client.db('eatTheFrog')
        removeDataFromDB(db)
    })

    var removeDataFromDB = function(db) {
        let id = req.body._id
        var collection = db.collection('eatTheFrog')
        collection.deleteOne({_id : ObjectID(id)},
            function(err, result){
            res.json(result)
            })
    }
})


// app.get('/', function(req, res){
//     res.render('home', {title: true, body: 'hello'})
// })
//
// app.get('/', function (req, res){
//     res.send('hello')
//     res.json({})
// })
//
// app.put('/task/:id', function (req, res){
//     res.send("Completed a new task!")
// })
//
// app.post('/task', function (req, res){
//     res.send(req.params)
// })
//
// app.delete('/task', function (req, res){
//     res.send("You've deleted a task!")
// })
//
// app.delete('/task/:id', function (req, res){
//     res.send(req.params)
// })

app.listen(3000)