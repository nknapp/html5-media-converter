var _ = require("underscore");
var path = require("path");
var Q = require("q");
var VideoConverter = require("./VideoConverter.js");
var Stream = require('stream');


/**
 *
 *
 * @param options configuration options
 * @param options.ffmpeg {String} path to ffmpeg
 * @param options.im {String} path to imagemagick
 * @constructor
 */
function MediaConverter(options) {
    options = _.defaults(options || {}, {
        programs: {
            // Path to the ffmpeg program
            ffmpeg: 'ffmpeg',
            // Path the the imagemagick convert program
            convert: 'convert'
        },
        videoFormats: ['mp4', 'ogv', 'webm'],
        simulate: false
    });

    /**
     * Converts a file to webm, mp4 and ogv and places those files in a specified directory.
     * Files are scaled down to a specified size
     * @param source
     * @param size
     * @param targetDir
     * @returns {*}
     */
    this.convert = function (source, size, targetDir) {
        console.log("Converting" + source);
        return Q.allSettled(options.videoFormats.map(function (format) {
            var defer = Q.defer();
            var converter = VideoConverter.defaults[format];
            if (converter) {
                var target = path.join(targetDir, path.basename(source).replace(/\..*?$/, converter.extName()));
                converter.convert(source, size, target, defer.makeNodeResolver());
                return defer.promise;
            } else {
                throw new Error("Could not find ffmpeg config for format '" + format * "'");
            }
        }));
    };

    /**
     * Returns map
     * @param size
     * @returns {Stream.Passthrough}
     */
    this.asStream = function(size) {
        var input = new Stream.PassThrough();
        var outputs = options.videoFormats.map(function(format) {
            var output = VideoConverter.defaults[format].toStream(size);
            input.pipe(output);
            return output
        });
        input.map = function(callback) {
            outputs.map(function(stream) {
                callback.call(stream,stream);
            });
        };
        return input;
    }

}


module.exports = MediaConverter;