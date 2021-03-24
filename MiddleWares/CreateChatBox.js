const chatBoxServices = require('../services/ChatBoxServices')
const accServices = require('../services/AccServices')

const createChatBox = (req,res,next) =>{
    const {members} = req.body
    chatBoxServices.create()
                   .then(chatBox => {
                        var arrMem = [] 
                        var arrPromise= []
                        members.forEach(member => {
                            arrMem.push(member)
                            arrPromise.push(accServices.addChatBox({id:member,value:chatBox._id}))   
                        })
                        arrPromise.push(chatBoxServices.addAccounts({id:chatBox._id,value:arrMem}))
                        Promise.all(arrPromise)
                                .then(data =>{
                                    if(next != undefined){
                                        req.chatBoxID = chatBox._id
                                        next()
                                    }
                                    else                                   
                                        res.status(201).json(data)
                                })
                                .catch(err => res.status(500).json({message:err}))

                    })
                     .catch(err => res.status(500).json({message:err}))
}

module.exports = {createChatBox}