const fs = require('fs');
const randString = require('./randString');
const interval = 10 * 60 * 1000;

process.env.UploadDirActive = process.env.UploadDir + '/' + randString(20);
process.env.UploadDirPrev = '';

const cleanDir = (dir) => {
    files = fs.readdirSync(dir);
    files.forEach((file) => {
        const path = dir + '/' + file;
        if(fs.lstatSync(path).isDirectory()){
            cleanDir(path);
        }else{
            fs.unlinkSync(path);
        }
    });
    fs.rmdirSync(dir);
}

const clean = () => {
    process.env.UploadDirPrev = process.env.UploadDirActive;
    process.env.UploadDirActive = process.env.UploadDir + '/' + randString(20);
    fs.mkdirSync(process.env.UploadDirActive);
    cleanDir(process.env.UploadDirPrev);
}

setInterval(clean, interval);
