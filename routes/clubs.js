var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

router.get('/', (req, res) => {
    // let long = req.query.long;
    // let lat = req.query.lat;
    // res.send(long + "+" + lat);
    // res.end();
    MongoClient.connect("mongodb://admin:admin@ds115701.mlab.com:15701/cycling_club", (err, db) => {
            if (err) {
                console.log(err);
                return false;
            }
            let long = parseFloat(req.query.long);
            let lat = parseFloat(req.query.lat);
            var location = db.collection('clubs');
            location.createIndex({ 'location': '2dsphere' });
            var cursor = location
                .find({
                    'location': {
                        '$near': {
                            '$geometry': { 'type': 'Point', 'coordinates': [long, lat] },
                            '$maxDistance': 10000
                        }
                    }
                });
            cursor.toArray((err, data) => {
                console.log(data);
                res.send(data);
                res.end();
                db.close();

            });
            // res.send(result);
            // res.end;
            // db.close();
        })
        // res.send('Long: ' + req.query.long + " and Lat: " + req.query.lat);
});
module.exports = router;