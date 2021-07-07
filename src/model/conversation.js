const mongoose = require("mongoose");
const uri = "mongodb+srv://Qwerty2605:Qwerty2605@cluster0.pe6tb.mongodb.net/CHATDATA?retryWrites=true&w=majority";
const moment = require('moment-timezone');
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("db connected2")
    })
    .catch(err => console.log(err))

// create Schema

const ConversationSchema = new mongoose.Schema({
    senderid: String,

    recid: String


});


module.exports = mongoose.model("Conversation", ConversationSchema);