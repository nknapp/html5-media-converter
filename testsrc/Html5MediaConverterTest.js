var path = require("path");
var MediaConverter = require("../src/Html5MediaConverter.js");
var mc = new MediaConverter();
var fs = require("fs");

var source = path.resolve(__dirname, "../testdata/video.mp4");

var setup = require("./setup.js");


module.exports.testConvert = function (test) {
    setup("testConvert").then(function (targetDir) {
        return mc.convert(source, "200x200", path.join(targetDir))
    }).done(function () {
        test.done();
    });
};

module.exports.testStream = function (test) {
    setup("testStream").done(function (targetDir) {
        var c = 0;
        fs.createReadStream(source).pipe(mc.asStream("200x200")).map(function (stream) {
            c++;
            var target = fs.createWriteStream(path.join(targetDir, "video" + stream.videoConverter.extName()));
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

