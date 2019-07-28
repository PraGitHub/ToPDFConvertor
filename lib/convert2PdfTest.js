const Convert2Pdf = require('./convert2Pdf');
const inputDir = __dirname + '/images';

const Convert2PdfObj = new Convert2Pdf(inputDir, (err, outDir, results) => {
    if(err){
        console.log('Convert2Pdf returned an error = ', err);
    }else{
        console.log('Output directory = ', outDir);
        results.forEach(result => {
            console.log('result = ', result);
        });
    }
});


console.log('Waiting for conversion');
setTimeout(() => {
    console.log('After 5 seconds');
}, 5000);