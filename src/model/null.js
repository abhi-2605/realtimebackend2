const mongoose = require("mongoose");
const uri = "mongodb+srv://Qwerty2605:Qwerty2605@cluster0.pe6tb.mongodb.net/CHATDATA?retryWrites=true&w=majority";
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("db connected4")
    })

//creating a schema
const MessageSchema = new mongoose.Schema({
    convid: {
        type: String,
    },
    from: {
        type: String,
    },
    to: {
        type: String
    },
    msg: {
        type: String,
    },
}, );

module.exports = mongoose.model("null", MessageSchema);