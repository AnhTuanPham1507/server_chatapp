const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'anhtuanpham1507',
    api_key :'527374515711284',
    api_secret:'2kA3NFsnfQyHcPkLoVjBjCsMhCo'
})
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer')
const path = require('path');

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'img',
        format : async (req,file) =>  path.extname(file.originalname).toLowerCase().substring(1),
        public_id : (req,file) => file.fieldname + '-' + Date.now()
    }
})

const fileFilter = (file,cb) =>{
    const fileTypes =  /jpeg|jpg|png|gif/

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = fileTypes.test(file.mimetype)

    if(extname && mimetype)
        return cb(null,true)
    else
        cb(`Error: Image only `)
}

const upload = multer({
    storage:storage,
    limits:{fileSize:10000000},
    fileFilter: (req,file,cb)=>{
        fileFilter(file,cb)
    }
}).single('myFile')

const uploadFile = (req,res,next)=>{
    upload(req,res , (err)=>{
        if(err instanceof multer.MulterError){
            res.status(500).josn({message:err})
        }
        else if(err){
            res.status(400).json({message:err})
        }
        else{
            next()
        }
    })
}
module.exports = {uploadFile}