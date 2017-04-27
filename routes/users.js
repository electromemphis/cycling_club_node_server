var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

router.get('/', (req, res) => {
    res.send('GET OK');
})

/* Add users to Database. */
router.post('/', function(req, res, next) {

    MongoClient.connect("mongodb://admin:admin@ds115701.mlab.com:15701/cycling_club", (err, db) => {
        if (err) {
            console.log(err);
            return false;
        }
        let doc = {
            name: req.body.name,
            email: req.body.email,
            location: {
                type: "Point",
                coordinates: [req.body.lat, req.body.long]
            },
            image: req.body.image,
            user_id: req.body.user_id
        }
        let query = { 'user_id': req.body.user_id };
        db.collection('users').update(query, doc, { 'upsert': true }, (err, nUpserted) => {
            if (err) throw err;
            res.send('Uprested : ' + nUpserted);
            res.end();
            return db.close();
        })
    })
});

module.exports = router;