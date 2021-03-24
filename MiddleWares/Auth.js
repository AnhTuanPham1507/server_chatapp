const accServices = require('../services/AccServices.js')
const {JWT_SECRET} = require('../config/jwt_secret')
const jwt = require('jsonwebtoken')

const requireAcc  = (req,res,next)=>{
    const token = req.headers['x-token']
    try{
        const encoded = jwt.verify(token,JWT_SECRET)
        accServices.findByID(encoded._id)
                    .then(acc=>{
                        if(acc!= null){
                            req.acc = acc
                            next()
                        }
                        else{
                            res.status(400).json({message:"Wrong token"})
                        }
                    })
                    .catch(err=>{
                        res.status(400).json({message:err})
                    })
    }
    catch(err){
        res.status(400).json({message:"Wrong token"})
    }
}

module.exports = {requireAcc}