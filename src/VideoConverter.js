var ffmpeg = require("fluent-ffmpeg");
var ProcessStreams = require("process-streams");
var ps = new ProcessStreams();

/**
 * Creates a new
 * @param options.streamEncoding {Boolean}
 * @param options.args {Array.<String>}
 * @param options.ext {String}
 * @param options.name {String} a name for the converter
 * @constructor
 */
function VideoConverter(options) {

    var _this = this;

    this.name = function() {
        return options.name;
    };

    this.extName = function () {
        return options.ext;
    };

    /**
     * Generate a stream from the video converter
     * @param size
     * @returns {*}
     */
    this.toStream = function (size) {
        var factory = ps.factory(false, !options.streamEncoding, function (input, output, callback) {
            var stream = this;
            var ffm = _this.convert(input, size, output, callback);
            ['start','progress','error'].forEach(function(event) {
                ffm.on(event, function() {
                    stream.emit.apply(stream,[event].concat(arguments));
                });
            });
        });
        factory.videoConverter = this;
        return factory;
    };

    this.convert = function (input, size, output, callback) {
        var ffm = ffmpeg(input).outputOptions(options.args);
        ffm.on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        });
        if (size) {
            var match = size.match(/(\d+)x(\d+)/);
            if (match) {
                ffm.addOutputOptions("-vf", scale(match[1], match[2]));
            } else {
                throw new Error("Illegal size specification: "+size);
            }
        }
        ffm.output(output);
        ffm.on("error", function (error, stdout, stderr) {
            error.stderr = stderr;
            callback(error);
        });
        ffm.run();
        if (typeof(output) === "string") {
            // If 'output' is a file, the callback must be called after ffmpeg has finished (only then is the file ready)
            ffm.on("end", function () {
                callback();
            });
        } else {
            callback();
        }
        return ffm;
    }
}

/**
 * @function
 * @param ffmpegPath {string}
 */
VideoConverter.setFfmpegPath = ffmpeg.setFfmpegPath;

/**
 * Compute ffmpeg parameter for scaling to fit box
 * (see http://stackoverflow.com/questions/8133242/ffmpeg-resize-down-larger-video-to-fit-desired-size-and-add-padding)
 * @param width
 * @param height
 * @returns {string}
 */
function scale(width, height) {
    return "scale=\"iw*min(" + width + "/iw\\," + height + "/ih):ih*min(" + width + "/iw\\," + height + "/ih)\"";
}

/**
 * This file contains command-lines for converting videos to a web-usable format.
 * The configurations are based on the great blog article
 * https://blog.mediacru.sh/2013/12/23/The-right-way-to-encode-HTML5-video.html
 **/

module.exports = VideoConverter;
