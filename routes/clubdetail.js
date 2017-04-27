var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var dbPath = "mongodb://admin:admin@ds115701.mlab.com:15701/cycling_club";
var db = mongojs(dbPath);
var ObjectId = mongojs.ObjectId;
//old chat
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
        socket.on('add-message', (message) => {
            //check message
            // io.emit('message', {type:'new-message', text: message.}); 
            console.log("socket");
            console.log(message);
            io.emit('message', message);
        });
        socket.on('stop-emergency',(event)=>{
            console.log("SOCKET STOP EMERGENCY");
            io.emit('message',{type:"stop",event:event});
        });

        socket.on('emergency-message', (event) => {
            console.log("SOCKET RECEIVED MESSAGE="); 
            io.emit('message', {type:'new-message', event: event});    
        });
});
const port = 3000;
http.listen(port, () => {
        console.log('started on port '+port);
});
//chat

//http://localhost:3000/clubs
router.get('/', (req, res, next) => {
        console.log("cycle requests");
        db.clubs.find((err, clubs) => {
            if (err) { res.send(err); }
            res.json(clubs);
        })
});

//http://localhost:3000/clubs/id 
router.get('/:id', (req, res, next) => {
        var id = req.params.id;
        db.clubs.findOne({ _id: ObjectId(id) }, function (err, club) {
            res.json(club);
        });
});

//http://localhost:3000/clubs/announcement
router.post('/announcement', function (req, res, next) {
        var rq = req.body;
        var query = { _id: ObjectId(rq.cid) };
        var operation = {
            '$addToSet': {
                announcements: {
                    details: rq.details,
                    createdBy: {
                        name: rq.createdBy.name,
                        email: rq.createdBy.email
                    }
                }
            }
        }
        var option = { upsert: true };
        console.log(req.body);

        db.clubs.update(query, operation, option, function (err, item) {
            if (err) console.log(err);
            console.dir(item);
            res.send('updated');
        })
});

//http://localhost:3000/clubs/event
router.post('/event', function (req, res, next) {    
   
    //insert to club collection
        var dt = {
            details: req.body.details,
            status: req.body.status,
            current_location: req.body.current_location,
            owner: {
                name: req.body.owner.name,
                email: req.body.owner.email,
                user_id: req.body.owner.user_id
            },
            club_name: req.body.club_name,
            club_members: req.body.club_members
        }
        //console.log(dt);

        db.events.insert(dt, function (err, item) {
            if (err) console.log(err);
            console.dir(item);
            console.log('inserted qwerty');
            //res.send('Inserted to events collection!!');
        })

        //insert to club collection 
        var query = { _id: ObjectId(req.body.cid) };
        var options = { upsert: true };
        var operation = {
            '$addToSet': {
                events: {
                    name: req.body.details,
                    status: req.body.status,
                    owner: {
                        name: req.body.owner.name,
                        email: req.body.owner.email
                    }
                }
            }
        }
        db.clubs.update(query, operation, options, function (err, item) {
            if (err) console.log(err);
            console.dir(item);
        })
        res.send('Inserted to events & clubs collection!!');
        //res.render('index', { title: 'Express' });
});

//http://localhost:3000/clubs/member' + id
router.get('/member/:id', (req, res, next) => {
        console.log("OhmBHrimSankateMamaRogamNashayaSwaha");
        var query = { user_id: req.params.id };

        db.users.find(query, (err, user) => {
            if (err) { res.send(err); }
            console.dir(user);
            res.json(user);
        })
});


router.get('/location/:id', (req, res, next) => {
        var query = { user_id: req.params.id };
        db.users.findOne(query, function (err, user) {
            if (err) { res.send(err); }
            console.dir(user);
            res.json(user);
        });

});

module.exports = router;