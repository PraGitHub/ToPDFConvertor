const compressImages = require('compress-images');

const options = { 
    compress_force: false, 
    statistic: true, 
    autoupdate: true 
};

const jpgEngine = { engine: 'mozjpeg', command: ['-quality', '25']};
const pngEngine = { engine: 'pngquant', command: ['--quality=25'] };
const svgEngine = { engine: 'svgo', command: '--multipass' };
const gifEngine = { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']};

const compressImage = (inDir, outDir, cb) => {
    const lastChar = outDir.charAt(outDir.length - 1);
    if(lastChar != '/' || lastChar != '\\'){
        outDir = outDir + '/';
    }
    compressImages(
        inDir + '/*.jpg',
        outDir, 
        options, 
        false,
        { jpg: jpgEngine },
        { png: pngEngine },
        { svg: svgEngine },
        { gif: gifEngine },
        (err, completed, statistic) => {
            if(err){
                return cb(err, null);
            }else{
                return cb(null, {
                    success: completed,
                    inSize: statistic.size_in,
                    outSize: statistic.size_output,
                    percentageCompression: statistic.percent
                });
            }
        }
    );
}

module.exports = compressImage;

