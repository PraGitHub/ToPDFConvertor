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
        filename = path.substr(index + 1);
    }
    return filename;
}

module.exports.getFileFormat = getFileFormat;
module.exports.getFileName = getFileName;
module.exports.getFileNameGivenPath = getFileNameGivenPath;