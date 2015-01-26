var VideoConverter = require("./VideoConverter.js");
var ImageConverter = require("./ImageConverter.js");

var converters = {
    mp4: new VideoConverter({
        streamEncoding: false,
        args: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'baseline', '-preset', 'fast', '-crf', '18', '-f', 'mp4'],
        ext: '.mp4',
        name: 'mp4'
    }),
    webm: new VideoConverter({
        streamEncoding: true,
        args: ['-c:v', 'libvpx', '-pix_fmt', 'yuv420p', '-c:a', 'libvorbis', '-quality', 'good', '-b:v', '2M', '-crf', '5', '-f', 'webm'],
        ext: '.webm',
        name: 'webm'
    }),
    ogv: new VideoConverter({
        streamEncoding: true,
        args: ['-c:v', 'libtheora', '-pix_fmt', 'yuv420p', '-c:a', 'libvorbis', '-q', '5', '-f', 'ogg'],
        ext: '.ogv',
        name: 'ogv'
    }),
    mp4_copy: new VideoConverter({
        streamEncoding: false,
        args: ['-c:v', 'copy', '-c:a', 'copy','-f','mp4'],
        ext: '.mp4',
        name: 'mp4_copy'
    }),
    jpeg: new ImageConverter({
        ext: '.jpg',
        format: 'jpeg',
        name: 'jpeg'
    })
};

var mapping = [
    {
        source: /video\/.*/,
        target: [ converters.mp4, converters.ogv, converters.webm ]
    },
    {
        source: /image\/.*/,
        target: [ converters.jpeg ]
    }
];

module.exports.converters = converters;

module.exports.convertersFor = function(mimetype) {
    for(var i=0; i<mapping.length; i++) {
        if (mimetype.match(mapping[i].source)) {
            return mapping[i].target;
        }
    }
};

