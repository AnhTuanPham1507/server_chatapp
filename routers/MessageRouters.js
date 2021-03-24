const {Router} = require('express')
const router = Router({mergeParams:true})
const {requireAcc} = require('../MiddleWares/Auth')
const {uploadFile} = require('../MiddleWares/UploadFile')
const messageServices = require('../services/MessageServices')

router.post('/',requireAcc,uploadFile,(req,res) => {
        const content = req.file.filename
        const acc_ID = req.acc._id
        const {type, chatBox_ID} = req.body
        messageServices.create({content , type , acc_ID , chatBox_ID})
                        .then(message => res.status(200).json(message))
                        .catch(err => res.status(500).json(err))
    })
    .get('/',requireAcc,(req,res) =>{
        const chatBox_ID = req.query.chatBox_ID
        const account = req.acc
        account["chatBoxs"].some(chatBoxID =>{
            if(chatBoxID == chatBox_ID){
                messageServices.findAllByCBID(chatBox_ID)
                                .then(messages => res.status(200).json(messages))
                                .catch(err => res.status(500).json({message:err}))
                 return true
            }
        })
    })
module.exports = {router}