const chatBox  = require("../models/ChatBoxModel")
const chatGroupServices = require('./ChatGroupServices')

const create = ()=>{
   return chatBox.create({})
}

const findByID = (ID) =>{
    return chatBox.findById(ID)
}

const findAll = () => {
    return chatBox.find({})
}

const find_CB_With_Name = async (chatBoxID,accountID) =>{
    const _chatBox = await chatBox.findById(chatBoxID)
                                    .select("-messages -__v")
                                    .populate({path:'accounts',select:"-email -password -__v -createdAt -chatBoxs -friends",match: { _id: {$ne: accountID}}})
   if(_chatBox["accounts"].length >1){
        const {name,avatar} = await chatGroupServices.findByCBID(_chatBox._id)
        return {name,avatar,_chatBox}
    }
    else
        return {name:_chatBox["accounts"][0].name ,avatar:_chatBox["accounts"][0].avatar,_chatBox}
   
}

const addAccounts = ({id,value}) =>{
    return chatBox.findByIdAndUpdate(id,
                                    {$push : {accounts:value}},
                                    {new: true , useFindAndModify:false})
}

module.exports = {create,findByID,findAll,find_CB_With_Name,addAccounts}