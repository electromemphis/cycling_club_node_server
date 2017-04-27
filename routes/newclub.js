var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

router.get('/', (req, res) => {
    res.send('GET OK');
})

router.post('/', (req, res, next) => {
    MongoClient.connect("mongodb://admin:admin@ds115701.mlab.com:15701/cycling_club", (err, db) => {
        if (err) {
            console.log(err);
            return false;
        }

        var location = db.collection('clubs');
        location.createIndex({ 'location.coordinates': 1 }, { 'unique': true });
        // let query = { 'location.coordinates': { '$ne': req.body.location.coordinates[0], '$ne': req.body.location.coordinates[1] } };
        location.insert(req.body, (err, nInserted) => {
            if (err) throw err;
            res.send('Inserted : ' + nInserted);
            res.end();
            return db.close();
        })

        // db.collection('clubs').insert(req.body, (err, nInserted) => {
        //     if (err) {
        //         console.log(err);
        //         return false;
        //     }
        //     res.send("Inserted: " + nInserted);
        //     res.end();
        // });
        // db.close();
    });
});

module.exports = router;