const compressImages = require('compress-images');
const fs = require('fs');
const helper = require('./helper');

const supportedFormat = [
    'jpeg',
    'jpg',
    'png',
    'svg',
    'gif'
];

const options = { 
    compress_force: false, 
    statistic: true, 
    autoupdate: true 
};

const jpgEngine = { engine: 'mozjpeg', command: ['-quality', '25']};
const pngEngine = { engine: 'pngquant', command: ['--quality=25'] };
const svgEngine = { engine: 'svgo', command: '--multipass' };
const gifEngine = { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']};

class CompressImages {
    constructor(inDir, outDir, callback) {
        this.inDir = inDir;
        this.outDir = outDir;
        this.callback = callback;
        this.todoFiles = [];
        this.length = 0;
        this.count = 0;
        this.results = [];
       
        if (!fs.existsSync(this.outDir)) {
            fs.mkdirSync(this.outDir);
        } else {
            this.callback(new Error('Output directory exists'));
        }
        fs.readdir(this.inDir, (err, files) => {
            if (err) {
                this.callback(err);
            } else {
                if (files.length <= 0) {
                    this.callback(new Error('No files exist'));
                } else {
                    files.forEach((file) => {
                        var format = helper.getFileFormat(file);
                        if (supportedFormat.indexOf(format) > -1) {
                            this.todoFiles.push(this.inDir + '/' + file);
                        }
                    });
                    this.length = this.todoFiles.length;
                    this.start();
                }
            }
        });
    }
    start() {
        const lastChar = this.outDir.charAt(this.outDir.length - 1);
        if(lastChar != '/' || lastChar != '\\'){
            this.outDir = this.outDir + '/';
        }
        //console.log('this.todoFiles', this.todoFiles);
        for (let i = 0; i < this.length; i++) {
            var inFile = this.todoFiles[i];
            compressImages(
                inFile,
                this.outDir,
                options,
                false,
                { jpg: jpgEngine },
                { png: pngEngine },
                { svg: svgEngine },
                { gif: gifEngine },
                (err, completed, statistic) => {
                    //console.log('statistic = ', statistic);
                    var tempjson = {};
                    if (err) {
                        tempjson['success'] = false;
                        tempjson['result'] = false;
                    } else {
                        tempjson['result'] = completed;
                        if(completed == true){
                            tempjson['filename'] = helper.getFileNameGivenPath(statistic.input);
                            tempjson['percentageCompression'] = statistic.percent;
                            tempjson['inFileSize'] = statistic.size_in;
                            tempjson['outFileSize'] = statistic.size_output;
                            tempjson['success'] = true;
                        }else{
                            tempjson['success'] = false;
                        }
                    }
                    this.results.push(tempjson);
                    this.count++;
                    if (this.count == this.length) {
                        this.callback(null, this.results);
                    }
                }
            );
        }
    }
}

module.exports = CompressImages;

