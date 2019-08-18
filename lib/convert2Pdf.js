const imagesToPdf = require("images-to-pdf");

const fs = require('fs');

const helper = require('./helper');

const supportedFormat = [
    'jpeg',
    'jpg',
    'png'
];

class Convert2Pdf {
    constructor(inDir, outDir, callback, options = {combine: false}){
        this.inDir = inDir;
        this.outDir = outDir;
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
        fs.readdir(this.inDir, (err, files) => {
            if(err){
                this.callback(err);
            }else{
                if(files.length <= 0){
                    this.callback(new Error('No files exist'));
                }else{
                        files.forEach((file) => {
                        var format = helper.getFileFormat(file);
                        if (supportedFormat.indexOf(format) > -1) {
                            this.todoFiles.push(this.inDir + '/' + file);
                            if(!this.combine){
                                this.destFiles.push(this.outDir + '/' + helper.getFileName(file) + '.pdf');
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
                tempjson['filename'] = helper.getFileNameGivenPath(this.outFile);
                tempjson['result'] = result;
                tempjson['success'] = true;
                this.results.push(tempjson);
                this.callback(null, this.outDir, this.results);
            }).catch((err) => {
                var tempjson = {};
                tempjson['outFile'] = this.outFile;
                tempjson['filename'] = helper.getFileNameGivenPath(this.outFile);
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
                    tempjson['filename'] = helper.getFileNameGivenPath(this.todoFiles[this.count]);
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
                    tempjson['filename'] = helper.getFileNameGivenPath(this.todoFiles[this.count]);
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