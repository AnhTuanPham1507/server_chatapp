const mongoose = require('mongoose')

const chatGroupSchema = new mongoose.Schema({
    chatBox:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chatbox'
    },
    name :{
        type:String,
        require:true,
        default:"Group Chat"
    },
    avatar:{
        type:String,
        default:"imagePro.jpg"
    }
})

const chatGroup = mongoose.model("chatGroup",chatGroupSchema)

module.exports = chatGroup