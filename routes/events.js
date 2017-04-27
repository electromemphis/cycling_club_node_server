var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var dbPath = "mongodb://admin:admin@ds115701.mlab.com:15701/cycling_club";
var db = mongojs(dbPath);
var ObjectId = mongojs.ObjectId;




// //old chat
// let app = require('express')();
// let http = require('http').Server(app);
// let io = require('socket.io')(http);


// io.on('connection',(socket)=>{
//     console.log("SOCKET CONNECTED!");
//     socket.on('disconnect',()=>{
//         console.log("SOCKET DISCONNECTED");
//     });

//     socket.on('stop-emergency',(event)=>{
//         console.log("SOCKET STOP EMERGENCY");
//         io.emit('message',{type:"stop",event:event});
//     });

//     socket.on('emergency-message', (event) => {
//          console.log("SOCKET RECEIVED MESSAGE="); 
//         io.emit('message', {type:'new-message', event: event});    
//     });
// });

// const port = 3000;
// http.listen(port, () => {
//         console.log('started on port '+port);
// });
//chat


//http://localhost:3000/events 
router.get('/', (req,res,next)=>{

    let long = parseFloat(req.query.long);
    let lat = parseFloat(req.query.lat);
    let type = req.query.type;
    let email = req.query.email;

    let query = {};
    if(type=='live'){
        console.log("finding live events..");
        // query={status:"started"};
        query = {
            $and : [
                    { $or : [ 
                                { club_members: {
                                    $elemMatch: {email:email}
                                }},
                                { "owner.email" : email} 
                            ]
                    },
                    { $or : [{status:"started"},{status:"emergency"}]}
            ]
        };
    }else{
        query = { $or : [ 
                        { club_members: {
                            $elemMatch: {email:email}
                        }},
                        { 'owner.email' : email} 
                    ]
            };
    }
    db.events.find(query,(err,events)=>{
        if(err){throw err;}

        res.json(events);
    });
});

router.get('/id',(req,res,next)=>{
    let eventId = req.query.id;
    console.log(" getting location for event_id ="+ eventId);
    var query = { _id: ObjectId(eventId) };
    db.events.findOne(query,(err,event)=>{
        if(err){res.send(err)}
        res.json(event);
    })
});


router.post('/join', (req,res,next)=>{
    console.log("event post requestsss");
    console.log(req.body);

    let query = {_id:ObjectId(req.body.event_id)};
    console.log("query=");console.log(query);
    let member = req.body.user;
    console.log(" req body member = "+member);
    var operation = {
        '$addToSet': {
            members: member
        }
    };
    var option = { upsert: true };

    db.events.update(query,operation,option,(err,event)=>{
        if(err){res.send(err)};

        console.dir(event);
        res.send("joined event..");
    });

});


router.post('/updateLocation',(req,res,next)=>{
    console.log("updating location.....");
    var rq = req.body;
    console.log("rq=="+rq);
    var query = {_id: ObjectId(rq.id)};
    var operation = {
        '$set':{
            current_location : {
                type : "Point",
                coordinates : [rq.long,rq.lat]
            }
        }
    };
    console.log("operation ====>");
    console.log(operation);
    console.log("body===>");
    console.log(rq);
    console.log("query==========>");
    console.log(query);
    var option = { upsert: true };
    db.events.update(query,operation,option,(err,event)=>{
        console.log("updating location....");
        if(err){res.send(err)};

        console.dir(event);
        res.send("event location updated..");
    });

});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + ":" + hour + ":" + min + ":" + sec;

}

router.post('/status', (req,res,next)=>{
    
    console.log(req.body);
    let query = {_id:ObjectId(req.body.event_id)};
    console.log("query=");console.log(query);
    let status = req.body.status;
    // var currDate = new Date().toLocaleDateString();
    var currDate = getDateTime();
    var operation;
    console.log("currDate formatted="+currDate);
    if(status=="started"){
        operation = {'$set':
                        {status:status,date_started:currDate}};
    }else if(status=="ended"){
        operation = {'$set':
                        {status:status,date_ended:currDate}};
    }else{
        operation = {'$set':{status:status}};
    } 
        
    var option = { upsert: true };

    db.events.update(query,operation,option,(err,event)=>{
        if(err){throw err;}
        res.send(currDate);
        res.end();
    });

});

module.exports = router;