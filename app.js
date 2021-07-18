const express = require('express');
const bodyParser = require('body-parser');
var app = new express()
const cors = require('cors');
var path = require('path');
app.use(cors());
var jwt = require('jsonwebtoken');
require('dotenv').config()
const register = require('./src/model/userdata.js')
const conversation = require('./src/model/conversation.js')
const messages = require('./src/model/messages.js')
const muteuser = require('./src/model/muteusers')
    // const revmessages = require('./src/model/revmsg.js')
const nulls = require('./src/model/null.js');

const recmsg = require('./src/model/revmsg.js');
const { MulterError } = require('multer');
// const revmsg = require('./src/model/revmsg.js');
// const revmsg = require('./src/model/revmsg.js');



app.use(bodyParser.json());
app.post('/register', function(req, res) {
    res.header('Access-Control-Allow-Origin', "*") // use of this that from any orgin u are getting the request of productapp then u they can acess
    res.header('Access-Control-Allow-Methds : GET , POST, PATCH , PUT ,DELETE ,OPTIONS');
    console.log(req.body);

    var data1 = {
        name: req.body.data.name,
        email: req.body.data.email,
        pass: register.hashPassword(req.body.data.pass),
        num: req.body.data.num
    }


    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            res.json({ msg: "already there" })
        } else {
            var data = new register(data1);
            res.json({ msg: "suc" })
            data.save();
        }
    });


});
//login
app.post('/login', function(req, res, next) {
    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            if (doc.isValid(req.body.data.pass)) {
                let token = jwt.sign({ name: doc._id }, 'secret', { expiresIn: '5h' });
                return res.status(200).json(token)
            } else {
                let abc = "Invalid password"
                res.json(abc);
            }
        } else {
            let abc = "User not resgistered"
            res.json(abc);
        }
    });
})


app.get('/username', verifyToken, function(req, res, next) {
    return res.status(200).json(decodedToken.name);
})

var decodedToken = '';

function verifyToken(req, res, next) {
    let token = req.query.token;

    jwt.verify(token, 'secret', function(err, tokendata) {
        if (err) {
            return res.json({ message: ' Unauthorized request' });
        }
        if (tokendata) {
            decodedToken = tokendata;
            next();
        }
    })
}
//posting a convo
app.post("/conversation", function(req, res) {
    const newconversation = new conversation({
        senderid: req.body.members.senderId,
        recid: req.body.members.receiverId
    });

    let promise = conversation.find({
        senderid: req.body.members.senderId,
        recid: req.body.members.receiverId

    })

    promise.then(function(doc) {
        console.log("here")
        if (doc != "") {
            // res.status(200).json(doc);
            res.send(doc)
            console.log("here2")

        } else {
            newconversation.save();
            console.log("here3")

        }

    });

    // conversation.find({
    //     senderid: req.body.members.senderId,
    //     recid: req.body.members.receiverId
    // }).
    // then(function(doc) {
    //     if (doc) {
    //         res.send(doc)
    //         console.log(doc)
    //     }
    // })
});


//get convo history a user
app.get("/:userId", function(req, res) {
    let promise = conversation.findOne({
        members: { $in: [req.params.userId] },
    })
    promise.then(function(doc) {
        if (doc) {
            res.status(200).json(doc);
        } else {
            let abc = "no convo"
            res.json(abc);
        }
    });

})

// get conv includes two userId

app.get("/find/:firstUserId/:secondUserId", function(req, res) {
    let promise = conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    })
    promise.then(function(doc) {
        if (doc) {
            res.status(200).json(doc);
        } else {
            let abc = "no convo"
            res.json(abc);
        }
    });
});

//add messeges
app.post("/messages", async(req, res) => {
    const newMessage = new messages(req.body.msgdet);

    try {

        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});
// get mesage
app.post("/convid", function(req, res) { // geting msgs of specific users 


    // conv id rec
    let promise = conversation.findOne({
        senderid: req.body.checkconv.userid,
        recid: req.body.checkconv.recid
    })
    promise.then(function(doc) {
        if (doc != "") {

            messages.find({ to: req.body.checkconv.recid, from: req.body.checkconv.userid }) // selects all the id which is not equal to the given id
                .then(function(data) {

                    if (data) {

                        res.send(data);
                    } else {
                        res.json({ id: "null", name: "NO SUCH USER REGISTERED" })
                    }

                });




        } else {

            nulls.find({}, function(err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(data);
                }
            });
        }
    });



});
app.get("/frnds/:id", function(req, res) {
    let name = req.params.id

    register.findOne({ name: name })
        .then(function(doc) {
            fname = {
                id: '',
                name: ''
            }
            fname.id = doc.id
            fname.name = doc.name
            res.send(fname);


        });

});

app.get("/allfrnds/:id", function(req, res) {
    let id = req.params.id


    register.find({ _id: { $nin: id } }).select('name') // selects all the id which is not equal to the given id
        .then(function(data) {

            if (data) {

                res.send(data);
            } else {
                res.json({ id: "null", name: "NO SUCH USER REGISTERED" })
            }

        });

});
app.get('/name/:id', function(req, res) {
    let id = req.params.id
    register.findOne({ _id: id }).select('name').then(function(data) {
        if (data) {
            res.send(data);
        } else {
            console.log('not found')
            res.send('not found')
        }
    });
})


// app.post("/revmsg", async(req, res) => {
//     condole.log("suc")
//     const revmsg = new recmsg({
//         revmsg: [req.body.data.msg, req.body.data.from, req.body.data.to],


//     });
//     console.log(revmsg)
//     try {
//         const savedConversation = await revmsg.save();
//         console.log(savedConversation)

//     } catch (err) {
//         res.status(500).json(err);
//     }
// })

app.post("/find", function(req, res) {
    console.log(req.body.data.to)
    var to = req.body.data.to
    var from = req.body.data.from
    console.log(from)


    let promise = recmsg.find({
        from: from,
        to: to
    })
    promise.then(function(doc) {
        if (doc) {


            res.send(doc);
            console.log(doc)
        } else {
            let abc = "no convo"
            res.json(abc);
        }
    });
});

app.post('/delmuteuser', (req, res) => {
    muteuser.deleteOne({ muteduser: req.body.data.muteduser, mutedby: req.body.data.mutedby })
    console.log('done suc')
})





app.listen(process.env.PORT || 2222)