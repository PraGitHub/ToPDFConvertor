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
    constructor(dir, callback, options = {combine: false}){
        this.dir = dir;
        this.outDir = dir + '/pdf';
        this.callback = callback;
        this.todoFiles = [];
        this.destFiles = [];
        this.length = 0;
        this.count = 0;
        this.results = [];
        this.combine = false;
        this.outFile = '';
        if(options && options.combine){
            this.combine = options.combine;
        }
        if(this.combine){
            this.outFile = this.outDir + '/combined.pdf';
        }
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
                            if(!this.combine){
                                this.destFiles.push(this.outDir + '/' + getFileName(file) + '.pdf');
                            }
                        }
                    });
                    this.length = this.todoFiles.length;
                    this.start();
                }
            }
        });
    }

    start(){
        if(this.combine){
            imagesToPdf(
                this.todoFiles, this.outFile
            ).then((result) => {
                var tempjson = {};
                tempjson['outFile'] = this.outFile;
                tempjson['filename'] = getFileNameGivenPath(this.outFile);
                tempjson['result'] = result;
                tempjson['success'] = true;
                this.results.push(tempjson);
                this.callback(null, this.outDir, this.results);
            }).catch((err) => {
                var tempjson = {};
                tempjson['outFile'] = this.outFile;
                tempjson['filename'] = getFileNameGivenPath(this.outFile);
                tempjson['result'] = err;
                tempjson['success'] = false;
                this.results.push(tempjson);
                this.callback(null, this.outDir, this.results);
            });
        }else{
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
}

module.exports = Convert2Pdf;