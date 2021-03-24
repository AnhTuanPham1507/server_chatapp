const {Router} = require('express')
const router = Router({ mergeParams: true })
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require("../config/jwt_secret")
const {requireAcc} = require('../MiddleWares/Auth')
const {uploadFile} = require('../MiddleWares/UploadFile')
const accServices = require('../services/AccServices')

router.post('/',uploadFile,(req,res)=>{
        const {myEmail,myPassword,myName} = req.body
        const avatar = req.file == undefined 
                    ? 'user.png' : req.file.filename
        if(myPassword != undefined ){
            const hashPassword = md5(myPassword)
            accServices.findByEmail(myEmail)
                    .then(acc=>{
                        if(acc){
                            res.status(400).json({message:"Email is existing"})
                            return
                        }
                        return Promise.resolve(true)
                    })
                    .then(()=>{
                        accServices.create({email:myEmail,password : hashPassword,name:myName,avatar})
                                    .then(createdAcc=>res.status(200).json(createdAcc))
                                    .catch(err => res.status(500).json({message:err}))
                    })
                    .catch(err=>res.status(500).json(err))
        }
        else
            return res.status(500).json({message:"password is empty"})
    })
    /* actually i have to create middleware to 
     check authorization to get account which have relationship */
    .get('/',(req,res) => {
        accServices.findAll()
                    .then(accounts => res.status(200).json(accounts))
                    .catch(err => res.status(500).json({message:err}))
    })

router
    .get('/authentication',requireAcc,(req,res)=>{
        res.status(200).json(req.acc)
    })
    .post('/authentication',async (req,res)=>{
        const {email,password} = req.body
        hashPassword = md5(password)
        const acc = await accServices.findByEmail(email)
        if(acc === null){
            res.status(400).json({message:"Wrong user"})
        }
        else if(acc.password !== hashPassword)
            res.status(400).json({message:"wrong password"})
        else{
            const token = jwt.sign(acc.toJSON(),JWT_SECRET)
            res.send(token)
        }
    })




module.exports = {router}