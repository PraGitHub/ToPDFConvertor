const multer = require('multer');
const fs = require('fs');
const randString = require('./randString');

if (!fs.existsSync(__dirname + '/uploads')) {
    fs.mkdirSync(__dirname + '/uploads');
}

class UploadArray{
    constructor(inputFieldNameAsinForm){
        this.dirname = randString();
        this.dir = __dirname + '/uploads/' + this.dirname; 
        this.files = [];
        this.storage = multer.diskStorage({
            destination: (req, FileObject, callback) => {
                if (!fs.existsSync(this.dir)) {
                    fs.mkdirSync(this.dir);
                }
                callback(null, this.dir);
            },
            filename: (req, FileObject, callback) => {
                callback(null, FileObject.originalname);
                this.files.push(FileObject.originalname);
            }
        });

        this.uploader = multer({ storage: this.storage });

        this.upload = this.uploader.array(inputFieldNameAsinForm);
    }
    uploadFiles(req, res, callback){
        this.upload(req, res, callback);
    }
}

module.exports = UploadArray;