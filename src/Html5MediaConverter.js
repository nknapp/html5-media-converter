var _ = require("underscore");
var path = require("path");
var VideoConverter = require("./VideoConverter.js");
var Stream = require('stream');
var magic = require('stream-mmmagic');
magic.config.magicFile = "(null),"+path.join(__dirname,"../misc/magic");
var presets = require("./presets.js");


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
        imageFormats: ['jpeg']
    });
    VideoConverter.setFfmpegPath(options.programs.ffmpeg);

    /**
     * Create a stream that converts the files to the specified size in a web-usable format.
     * @param size
     * @returns {Stream.PassThrough}
     */
    this.thumbs = function(size) {
        var input = new Stream.PassThrough();
        var storedCallback = null;
        input.forEach = function(callback) {
            storedCallback = callback;
        };
        magic(input,function(err,mimeType,stream) {
            presets.convertersFor(mimeType.type).forEach(function(converter) {
                stream.converter = converter;
                stream.pipe(converter.toStream(size));
                storedCallback.call(stream,stream);
            });
        });
        return input;
    };

    /**
     * Convert a video to an mp4 container without re-encoding.
     * @returns {converters.mp4_copy|*}
     */
    this.mp4Copy = function() {
        return presets.converters.mp4_copy.toStream();
    }
}


module.exports = MediaConverter;