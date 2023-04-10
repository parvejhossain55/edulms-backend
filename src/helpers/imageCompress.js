const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

const imageCompress = (filename)=>{
    return imagemin(['public/media/'+filename], {
        destination: 'public/media',
        plugins: [
            imageminMozjpeg({
                quality: 50
            }),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
}

module.exports = imageCompress;