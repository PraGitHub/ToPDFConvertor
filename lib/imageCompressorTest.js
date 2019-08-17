const imageCompressor = require('./imageCompressor');
const fs = require('fs');

const inDir = __dirname + '/imagesToCompress';
const outDir = __dirname + '/imagesToCompress/' + new Date().getTime();

/*
fs.readdir(inDir, (err, files) => {
    if(err){
        console.log('Error while reading directory,  error = ', err);
    }else{
        files.forEach((file) => {
            const inFile = inDir + '/' + file;
            imageCompressor(inFile, outDir, (err, res) => {
                if (err) {
                    console.log('Error while compressing, error = ', err);
                } else {
                    console.log('res = ', res);
                }
            });
        });
    }
});
*/

imageCompressor(inDir, outDir, (err, res) => {
    if (err) {
        console.log('Error while compressing, error = ', err);
    } else {
        console.log('res = ', res);
    }
});

const timeout = 20;

console.log('Waiting for ', timeout, ' seconds ...');
setTimeout(() => {
    console.log('output directory = ', outDir);
    console.log('Done waiting for ', timeout, ' seconds.');
}, timeout*1000);