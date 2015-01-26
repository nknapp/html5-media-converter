var path = require("path");
var MediaConverter = require("../src/Html5MediaConverter.js");
var mc = new MediaConverter();
var fs = require("fs");
var Q = require("q");
require("q-debug-mode")(Q);

var source = path.resolve(__dirname, "../testdata/video.mp4");

var setup = require("./setup.js");

module.exports.testStream = function (test) {
    setup("testStream").done(function (targetDir) {
        var c = 0;
        fs.createReadStream(source).pipe(mc.thumbs("200x200")).forEach(function (stream) {
            c++;
            var target = fs.createWriteStream(path.join(targetDir, "video" + stream.converter.extName()));
            target.on("finish", function () {
                c--;
                if (c == 0) {
                    test.done();
                }
            });
            stream.pipe(target);
        });
    });
};

module.exports.testMts = function(test) {
    setup("testStream").done(function (targetDir) {
        var c = 0;
        fs.createReadStream(source).pipe(mc.thumbs("200x200")).forEach(function (stream) {
            c++;
            var target = fs.createWriteStream(path.join(targetDir, "video" + stream.converter.extName()));
            target.on("finish", function () {
                c--;
                if (c == 0) {
                    test.done();
                }
            });
            stream.pipe(target);
        });
    });
};

