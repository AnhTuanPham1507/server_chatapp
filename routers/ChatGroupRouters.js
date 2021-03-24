const {Router} = require('express')
const router = Router({mergeParams:true})
const chatGroupServices = require('../services/ChatGroupServices')
const {createChatBox} = require('../MiddleWares/CreateChatBox')
const chatGroup = require('../models/ChatGroupModel')


router.post('/',createChatBox,(req,res)=>{
        const {name,avatar} = req.body
        const chatBoxID = req.chatBoxID
        chatGroupServices.create({chatBoxID,name,avatar})
                        .then(chatGroup => res.status(200).json(chatGroup))
                        .catch(err => res.status(500).json({message:err}))
    })

module.exports = {router}
