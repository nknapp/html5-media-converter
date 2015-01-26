

var im = require('imagemagick-stream');
var fs = require('fs');

/**
 *
 * @param options {object}
 * @param options.ext {string}
 * @param options.format {string} the imagemagick "-format" option
 *
 * @constructor
 */
function ImageConverter(options) {

    this.name = function() {
        return options.name;
    };

    this.extName = function () {
        return options.ext;
    };

    this.toStream =  function (size) {
        return im().resize(size).quality(90).options({
            format: options.format
        });
    };

    /**
     *
     * @param input {Stream|string} an input stream or input file
     * @param size {string} target size (box to fit the image into (e.g. "200x200"))
     * @param output
     * @param callback
     * @returns {*}
     */
    this.convert =  function (input, size, output, callback) {
        var inStream = typeof(input)==='string' ? fs.createReadStream(înput) : input;
        var outStream = fs.createWriteStream(output);

        var resize = this.toStream(size);

        inStream.on("error",handleError)
            .pipe(resize).on("error",handleError)
            .pipe(outStream).on("error",handleError);

        output.on("end",function() {
            callback();
        });
        function handleError(error) {
            resize.emit("error",error)
        }
        return resize;
    }


}

module.exports = ImageConverter;