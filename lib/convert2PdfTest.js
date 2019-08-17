const Convert2Pdf = require('./convert2Pdf');
const inputDirSep = __dirname + '/images_sep';
const inputDirCom = __dirname + '/images_com';
const outputDirSep = __dirname + '/images_sep/' + new Date().getTime();
const outputDirCom = __dirname + '/images_com/' + new Date().getTime();

const Convert2PdfObjSep = new Convert2Pdf(inputDirSep, outputDirSep, (err, outDir, results) => {
    if(err){
        console.log('Convert2Pdf returned an error = ', err);
    }else{
        console.log('Output directory = ', outDir);
        results.forEach(result => {
            console.log('result = ', result);
        });
    }
});

const Convert2PdfObjCom = new Convert2Pdf(inputDirCom, outputDirCom, (err, outDir, results) => {
    if (err) {
        console.log('Convert2Pdf returned an error = ', err);
    } else {
        console.log('Output directory = ', outDir);
        results.forEach(result => {
            console.log('result = ', result);
        });
    }
}, {combine: true});

const timeout = 10;

console.log('Waiting for conversion');
setTimeout(() => {
    console.log(`After ${timeout} seconds`);
}, timeout*1000);