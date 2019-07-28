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

const getFileNameGivenPath = (path) => {
    var index = path.lastIndexOf('/');
    var filename = '';
    if (index > -1) {
        filename = path.substr(index+1);
    }
    return filename;
}

class Convert2Pdf {
    constructor(dir, callback){
        this.dir = dir;
        this.outDir = dir + '/pdf';
        this.callback = callback;
        this.todoFiles = [];
        this.destFiles = [];
        this.length = 0;
        this.count = 0;
        this.results = [];
        if(!fs.existsSync(this.outDir)){
            fs.mkdirSync(this.outDir);
        }else{
            this.callback(new Error('Output directory exists'));
        }
        fs.readdir(dir, (err, files) => {
            if(err){
                this.callback(err);
            }else{
                if(files.length <= 0){
                    this.callback(new Error('No files exist'));
                }else{
                        files.forEach((file) => {
                        var format = getFileFormat(file);
                        if (supportedFormat.indexOf(format) > -1) {
                            this.todoFiles.push(this.dir + '/' + file);
                            this.destFiles.push(this.outDir + '/' + getFileName(file) + '.pdf');
                        }
                    });
                    this.length = this.todoFiles.length;
                    this.start();
                }
            }
        });
    }

    start(){
        for(let i=0; i<this.length; i++){
            var inFile = this.todoFiles[i];
            var outFile = this.destFiles[i];
            imagesToPdf(
                [inFile], outFile
            ).then((result) => {
                var tempjson = {};
                tempjson['outFile'] = this.destFiles[this.count];
                tempjson['filename'] = getFileNameGivenPath(this.todoFiles[this.count]);
                tempjson['result'] = result;
                tempjson['success'] = true;
                this.results.push(tempjson);
                this.count++;
                if(this.count == this.length){
                    this.callback(null, this.outDir, this.results);
                }
            }).catch((err) => {
                var tempjson = {};
                tempjson['outFile'] = this.destFiles[this.count];
                tempjson['filename'] = getFileNameGivenPath(this.todoFiles[this.count]);
                tempjson['result'] = err;
                tempjson['success'] = false;
                this.results.push(tempjson);
                this.count++;
                if (this.count == this.length) {
                    this.callback(null, this.outDir, this.results);
                }
            });
        }
    }
}

module.exports = Convert2Pdf;