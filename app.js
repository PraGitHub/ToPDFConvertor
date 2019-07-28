//upload dir
process.env.UploadDir = __dirname + '/uploads';

const fs = require('fs');
const imagesToPdf = require("images-to-pdf");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieSession = require('cookie-session');
const randString = require('./lib/randString');
const UploadArray = require('./lib/upload');
const Convert2Pdf = require('./lib/convert2Pdf');
const zipFolder = require('./lib/zipFolder');

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

app.post('/convert', (req, res) => {
    const id = req.body['id'];
    console.log('POST /convert :: id = ', id);
    const Convert2PdfObj = new Convert2Pdf(process.env.UploadDir + '/' + id, (err, outDir, results) => {
        if (err) {
            console.log('Convert2Pdf returned an error = ', err);
            res.render('conversionFailed');
        } else {
            //console.log('Output directory = ', outDir);
            //results.forEach(result => {
                //console.log('result = ', result);
            //});
            res.render('conversionSuccess', {
                results: results,
                id: id
            });
        }
    });
});

app.post('/download', (req, res) => {
    const id = req.body['id'];
    console.log('POST /download :: id = ', id);
    var source = process.env.UploadDir + '/' + id + '/pdf';
    var destination = process.env.UploadDir + '/' + id + '/' + randString(20) + '.zip';
    zipFolder(source, destination, (err, result) => {
        if (err) {
            console.log('zipFolder returned error = ', err);
            res.render(err);
        } else {
            console.log('zipFolder result = ', result);
            res.download(result);
        }
    });
});
