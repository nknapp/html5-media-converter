var MediaConverter = require("../src/MediaConverter.js");
var path = require("path");
var mc = new MediaConverter();
var fs = require("fs");

var source = path.resolve(__dirname, "../testdata/video.mp4");

var targetDir = path.resolve(__dirname, "../tmp");
var i=0;
//require("q").longStackSupport = true;
var qfs = require("q-io/fs");

module.exports.setUp = function (callback) {
    targetDir = targetDir + "a";
    qfs.exists(targetDir).then(function (exists) {
        if (exists) {
            return qfs.removeTree(targetDir);
        } else {
            return true;
        }
    }).then(function () {
        return qfs.makeTree(targetDir);
    }).nodeify(callback);
};

module.exports.testConvert = function (test) {
    mc.convert(source, "200x200", path.join(targetDir))
        .catch(function (err) {
            console.log(err);
        }).done(function () {
            console.log("done");
            test.done();
        });
};

module.exports.testStream = function (test) {
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

};
