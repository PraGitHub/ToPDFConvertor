const { zip } = require('zip-a-folder');
const randString = require('./randString');

const compress = (source, destination, callback) => {
    zip(source, destination).then(() => {
        console.log('successfully zipped');
        callback(destination, null);
    }).catch((err) => {
        console.log('zip returned error = ', err);
        callback(null, err);
    });
}

module.exports = compress;