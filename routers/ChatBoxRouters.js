const {Router} = require('express')
const router = Router({mergeParams:true})
const chatBoxServices = require('../services/ChatBoxServices')
const accServices = require('../services/AccServices')
const {createChatBox} = require('../MiddleWares/CreateChatBox')
const {requireAcc} = require('../MiddleWares/Auth')
const chatGroup = require('../models/ChatGroupModel')

router.post('/',createChatBox)
      .get('/',requireAcc,(req,res)=>{
            const account =  req.acc
            const accountID = String(account._id)
            var promises = []
             account["chatBoxs"].forEach(chatBoxID =>{
                 promises.push(chatBoxServices.find_CB_With_Name(String(chatBoxID),accountID))
             })
             Promise.all(promises)
                    .then(data => res.status(200).json(data))
                    .catch(err => res.status(500).json({message:err}))
      })

router.patch('/addMember',(req,res)=>{
    const {accountID,chatBoxID} = req.body
    chatGroup.find({chatBoxID})
            .then(chatGroup =>{
                chatBoxServices.addAccounts({id:chatBoxID,value:accountID})
                                .then(chatBox => {
                                    accServices.addChatBox({id:accountID,value:chatBoxID})
                                                .then(account => res.status(200).json(account))
                                                .catch(err => res.status(500).json({message:err}))
                                })
                                .catch(err => res.status(500).json({message:err}))
            })
            .catch(err => res.status(400).json({message:"just chat group can add member "}))
})

module.exports = {router,createChatBox}