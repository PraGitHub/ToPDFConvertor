const fs = require('fs');
const imagesToPdf = require("images-to-pdf");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieSession = require('cookie-session');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

//upload dir
process.env.UploadDir = __dirname + '/uploads';

const randString = require('./lib/randString');
const cleanDir = require('./lib/cleanDir');
const UploadArray = require('./lib/upload');
const Convert2Pdf = require('./lib/convert2Pdf');
const ImageCompressor = require('./lib/imageCompressor');
const zipFolder = require('./lib/zipFolder');

const httpPort = process.env.PORT || 8080;

const app = express();

//configure compression middleware
app.use(compression());

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
            
            res.render('failure', {message: 'Upload failed'});
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
    const combine = req.body['combine'] == 'on';
    const compress = req.body['compress'] == 'on';
    const dontconvert = req.body['dontconvert'] == 'on';

    //console.log('POST /convert :: id = ', id, ' combine = ', combine, ' compress = ', compress, ' dontconvert = ', dontconvert);

    const rootDir = process.env.UploadDirActive + '/' + id;
    const outDirConv = rootDir + '/pdf';
    const outDirComp = rootDir + '/compressed';

    var jsonToRender = {};
    jsonToRender['id'] = id;
    jsonToRender['showCompressionResults'] = false;
    jsonToRender['showConversionResults'] = false;
    jsonToRender['compressed'] = false;
    jsonToRender['converted'] = false;

    if(compress){
        const imageCompressorObj = new ImageCompressor(rootDir, outDirComp, (err, results) => {
            if (err) {
                console.log('Error while compressing, error = ', err);
                jsonToRender['showCompressionResults'] = true;
                jsonToRender['compressionResults'] = ['Error while compressing'];
                //res.json(jsonToRender);
                res.render('failure', {message: 'Compression failed'});
            } else {
                //console.log('Compression Results = ', results);
                jsonToRender['compressed'] = true;
                jsonToRender['showCompressionResults'] = true;
                jsonToRender['compressionResults'] = results;
                if(!dontconvert){
                    const Convert2PdfObj = new Convert2Pdf(outDirComp, outDirConv, (err, outDir, results) => {
                        if (err) {
                            //console.log('Convert2Pdf returned an error = ', err);
                            cleanDir(rootDir);
                            //res.json(jsonToRender);
                            res.render('failure', { message: 'Conversion failed' });
                        } else {
                            ////console.log('Output directory = ', outDir);
                            //results.forEach(result => {
                            ////console.log('result = ', result);
                            //});
                            jsonToRender['showConversionResults'] = true;
                            jsonToRender['converted'] = true;
                            jsonToRender['conversionResults'] = results;
                            //res.json(jsonToRender);
                            res.render('convCompSuccess', jsonToRender);
                        }
                    }, 
                    {
                            combine: combine
                    });
                }else{
                    //res.json(jsonToRender);
                    res.render('convCompSuccess', jsonToRender);
                }
            }
        });
    }else if(!dontconvert){
        const Convert2PdfObj = new Convert2Pdf(rootDir, outDirConv, (err, outDir, results) => {
            if (err) {
                //console.log('Convert2Pdf returned an error = ', err);
                cleanDir(rootDir);
                //res.json(jsonToRender);
                res.render('failure', { message: 'Conversion failed' });
            } else {
                ////console.log('Output directory = ', outDir);
                //results.forEach(result => {
                ////console.log('result = ', result);
                //});
                jsonToRender['showConversionResults'] = true;
                jsonToRender['converted'] = true;
                jsonToRender['conversionResults'] = results;
                //res.json(jsonToRender);
                res.render('convCompSuccess', jsonToRender);
            }
        }, 
        {
             combine: combine
        });
    }
});

app.post('/download', (req, res) => {
    const id = req.body['id'];
    const type = req.body['type'];
    //console.log('POST /download :: id = ', id, ' type = ', type);
    var source = process.env.UploadDirActive + '/' + id + '/pdf';
    var destination = process.env.UploadDirActive + '/' + id + '/pdfs.zip';
    if(type == 'compressed'){
        source = process.env.UploadDirActive + '/' + id + '/compressed';
        destination = process.env.UploadDirActive + '/' + id + '/compressed.zip';
    }
    zipFolder(source, destination, (err, result) => {
        if (err) {
            //console.log('zipFolder returned error = ', err);
            res.render('failure', {message: 'Download failed'});
        } else {
            //console.log('zipFolder result = ', result);
            res.download(result);
        }
    });
});

app.use((req, res) => {
    res.status(404).render('notFound');
});
