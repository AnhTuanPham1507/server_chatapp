const account  = require("../models/AccModel");

const create = ({email,password,name,avatar})=>{
   return account.create({email,password,name,avatar})
}

const findByEmail = (email) =>{
    return account.findOne({email})
}

const findByID = (ID)=>{
    return account.findById(ID)
}

const findAll = () => {
    return account.find({})
}

const addChatBox = ({id,value}) => {
    return account.findByIdAndUpdate(id,
                                    {$push:{chatBoxs:value}},
                                    {new:true, useFindAndModify:false})
}

module.exports = {create , findByEmail , findByID , findAll , addChatBox}