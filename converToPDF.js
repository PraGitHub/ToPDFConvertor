const imagesToPdf = require("images-to-pdf")
//await imagesToPdf(["path/to/image1.jpg", "path/to/image2.png"], "path/to/combined.pdf")
// path/to/combined.pdf now exists.

const fs = require('fs');

fs.readdir(__dirname, (err, files) => {
    if(err) throw err;
    const outDir = __dirname+'/result';
    files.forEach(file => {
        var index = -1;
        if ((index = file.indexOf('.jpeg')) > -1 || (index = file.indexOf('.jpg')) > -1) {
            //console.log(file);
            var inFile = __dirname + '/' + file;
            var outFile = outDir + '/' + file.substr(0,index) + '.pdf';
            console.log('Input = ', inFile, "Output = ", outFile);
            imagesToPdf([inFile], outFile);
        } 
    });
});