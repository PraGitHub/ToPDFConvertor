const fs = require('fs');
const imagesToPdf = require("images-to-pdf");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieSession = require('cookie-session');
const randString = require('./randString');
const UploadArray = require('./upload');

const httpPort = process.env.PORT || 8080;

const app = express();

//configure body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//set view engine
app.set('view engine', 'ejs');

//configure cookie
app.use(cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: ['kgaojwarli']
}));

app.listen(httpPort, (err, res) => {
    if(err) throw err;
    console.log('Server @ '+httpPort);
    if(fs.existsSync(__dirname+'/uploads')==false){
        fs.mkdirSync(__dirname+'/uploads');
    }
    
});

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/upload', (req, res) => {
    var uploadArrayObj = new UploadArray('FilePath');
    uploadArrayObj.uploadFiles(req, res, (err) => {
        console.log('dirname = ', uploadArrayObj.dirname, 'files = ', uploadArrayObj.files);
        if (err) {
            console.log('upload error = ', err);
            res.render('uploadFailed');
        }
        res.render('uploadSuccess', {
            id: uploadArrayObj.dirname,
            files: uploadArrayObj.files
        });
    })
});

app.get('/convert/:id', (req, res) => {
    const id = req.params.id;
    if(id){
        
    }
    res.send(req.params.id);
});

app.get('/download/:id', (req, res) => {
    console.log(req.params.id);
    res.send(req.params.id);
});
