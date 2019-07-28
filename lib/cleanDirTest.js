const fs = require('fs');

const cleanDir = (dir) => {
    files = fs.readdirSync(dir);
    files.forEach((file) => {
        const path = dir + '/' + file;
        if (fs.lstatSync(path).isDirectory()) {
            cleanDir(path);
        } else {
            fs.unlinkSync(path);
        }
    });
    fs.rmdirSync(dir);
}

const dir = __dirname + '/' + 'uploads.1';

cleanDir(dir);