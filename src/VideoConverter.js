var ffmpeg = require("fluent-ffmpeg");
var ProcessStreams = require("process-streams");
var ps = new ProcessStreams();

/**
 * Creates a new
 * @param options.streamEncoding {Boolean}
 * @param options.args {Array.<String>}
 * @param options.ext {String}
 * @constructor
 */
function VideoConverter(options) {

    var _this = this;

    this.extName = function () {
        return options.ext;
    };

    this.toStream = function (size) {
        return ps.factory(false, !options.streamEncoding, function (input, output, callback) {
            _this.convert(input,size,output,callback);
        });
    };

    this.convert = function (input, size, output, callback) {
        var outputTmpFile = typeof(output)==="string";
        var ffm = ffmpeg(input).outputOptions(options.args).size(size).output(output);
        ffm.on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done');
        });
        ffm.on("error", function(error,stdout,stderr) {
            error.stderr = stderr;
            callback(error);
        });
        if (outputTmpFile) {
            ffm.on("end", function() {
                callback();
            });
        }
        ffm.run();
        if (!outputTmpFile) {
            callback();
        }
    }
}

/**
 * This file contains command-lines for converting videos to a web-usable format.
 * The configurations are based on the great blog article
 * https://blog.mediacru.sh/2013/12/23/The-right-way-to-encode-HTML5-video.html
 **/

module.exports = VideoConverter;
module.exports.defaults = {
    mp4: new VideoConverter({
        streamEncoding: false,
        args: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'baseline', '-preset', 'fast', '-crf', '18', '-f', 'mp4'],
        ext: '.mp4'
    }),
    webm: new VideoConverter({
        streamEncoding: true,
        args: ['-c:v', 'libvpx', '-pix_fmt', 'yuv420p', '-c:a', 'libvorbis', '-quality', 'good', '-b:v', '2M', '-crf', '5', '-f', 'webm'],
        ext: '.webm'
    }),
    ogv: new VideoConverter({
        streamEncoding: true,
        args: ['-c:v', 'libtheora', '-pix_fmt', 'yuv420p', '-c:a', 'libvorbis', '-q', '5', '-f', 'ogg'],
        ext: '.ogv'
    })
};
