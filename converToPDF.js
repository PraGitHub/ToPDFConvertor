const imagesToPdf = require("images-to-pdf");

const fs = require('fs');

const supportedFormat = [
    'jpeg',
    'jpg',
    'png'
];

const getFileFormat = (filename) => {
    filename = filename.toLocaleLowerCase();
    var index = filename.lastIndexOf('.');
    if(index > -1){
        return filename.substr(index + 1);
    }   
    return '';
}

fs.readdir(__dirname, (err, files) => {
    if(err) throw err;
    const outDir = __dirname+'/result';
    if(!fs.existsSync(outDir)){
        fs.mkdirSync(outDir);
    }
    files.forEach((file) => {
        var index = -1;
        var format = getFileFormat(file);
        console.log('file = ', file);
        console.log('format = ', format);
        if(supportedFormat.indexOf(format) > -1){
            var inFile = __dirname + '/' + file;
            var outFile = outDir + '/' + file.substr(0,index) + '.pdf';
            console.log('Input = ', inFile, "Output = ", outFile);
            imagesToPdf([inFile], outFile);
        }else{
            console.log('File format not supported !');
        }
    });
});