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
    if (index > -1) {
        return filename.substr(index + 1);
    }
    return '';
}

const getFileName = (filename) => {
    var index = filename.lastIndexOf('.');
    if (index > -1) {
        return filename.substr(0, index);
    }
    return '';
}

const convert = (dir, callback) => {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        const outDir = dir + '/pdf';
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }
        var resultJson = {};
        files.forEach((file) => {
            var index = -1;
            var format = getFileFormat(file);
            if (supportedFormat.indexOf(format) > -1) {
                var inFile = dir + '/' + file;
                var filename = getFileName(file);
                var outFile = outDir + '/' + filename + '.pdf';
                imagesToPdf([inFile], outFile).then((result) => {
                    
                }).catch((err) => {

                });
            } else {

            }
        });
    });
}