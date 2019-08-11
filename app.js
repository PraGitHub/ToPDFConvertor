const fs = require('fs');
const imagesToPdf = require("images-to-pdf");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieSession = require('cookie-session');
const rateLimit = require('express-rate-limit');

//upload dir
process.env.UploadDir = __dirname + '/uploads';

const randString = require('./lib/randString');
const cleanDir = require('./lib/cleanDir');
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
    maxAge: 10 * 60 * 1000,
    keys: ['kgaojwarli']
}));

//rate limit
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.listen(httpPort, (err, res) => {
    if(err) throw err;
    //console.log('Server @ '+httpPort);
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/notice', (req, res) => {
    res.render('notice');
});

app.post('/upload', (req, res) => { 
    var uploadArrayObj = new UploadArray('FilePath');
    uploadArrayObj.uploadFiles(req, res, (err) => {
        //console.log('dirname = ', uploadArrayObj.dirname, 'files = ', uploadArrayObj.files);
        if (err) {
            //console.log('upload error = ', err);
            
            res.render('uploadFailed');
        }else{
            res.render('uploadSuccess', {
                id: uploadArrayObj.dirname,
                files: uploadArrayObj.files
            });
        }
    })
});

app.post('/convert', (req, res) => {
    const id = req.body['id'];
    const combine = req.body['combine'];
    console.log('POST /convert :: id = ', id);
    console.log('POST /convert :: combine = ', combine);
    const Convert2PdfObj = new Convert2Pdf(process.env.UploadDirActive + '/' + id, (err, outDir, results) => {
        if (err) {
            //console.log('Convert2Pdf returned an error = ', err);
            res.render('conversionFailed');
        } else {
            ////console.log('Output directory = ', outDir);
            //results.forEach(result => {
                ////console.log('result = ', result);
            //});
            res.render('conversionSuccess', {
                results: results,
                id: id
            });
        }
    }, {combine: (combine == 'on')});
});

app.post('/download', (req, res) => {
    const id = req.body['id'];
    //console.log('POST /download :: id = ', id);
    var source = process.env.UploadDirActive + '/' + id + '/pdf';
    var destination = process.env.UploadDirActive + '/' + id + '/pdfs.zip';
    zipFolder(source, destination, (err, result) => {
        if (err) {
            //console.log('zipFolder returned error = ', err);
            res.render(err);
        } else {
            //console.log('zipFolder result = ', result);
            res.download(result);
        }
    });
});

app.use((req, res) => {
    res.status(404).render('notFound');
});
