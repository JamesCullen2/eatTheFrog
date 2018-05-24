const express = require('express')

const { body } = require('express-validator/check')

const app = express()

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/eatTheFrog'

const ObjectID = require('mongodb').ObjectID

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())

// MongoDB get route
app.get('/tasks', function(req, res) {

    MongoClient.connect(url, function (err, client) {
        console.log('Connected to mongoDb, lol')
        let db = client.db('eatTheFrog')
        getDataFromDB(db)
    })

     function getDataFromDB (db) {
        var collection = db.collection('eatTheFrog')
        collection.find({}).toArray(function (err, docs) {
            res.json(docs)
        })
    }
})

// MongoDB insert into query
app.post('/task', body().isString(), function (req, res){

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

app.listen(3000)