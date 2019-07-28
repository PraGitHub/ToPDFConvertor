const { zip } = require('zip-a-folder');
const randString = require('./randString');

const compress = (source, destination, callback) => {
    zip(source, destination).then(() => {
        console.log('successfully zipped');
        callback(null, destination);
    }).catch((err) => {
        console.log('zip returned error = ', err);
        callback(err, null);
    });
}

module.exports = compress;