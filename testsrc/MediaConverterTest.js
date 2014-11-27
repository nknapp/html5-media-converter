var MediaConverter = require("../src/MediaConverter.js");
var path = require("path");
var mc = new MediaConverter();

var source = path.resolve(__dirname, "../testdata/video.mp4");

var targetDir = path.resolve(__dirname, "../tmp");
//require("q").longStackSupport = true;
var fs = require("q-io/fs");

module.exports = {
    setUp: function (callback) {
        fs.exists(targetDir).then(function (exists) {
            if (exists) {
                return fs.removeTree(targetDir);
            } else {
                return true;
            }
        }).then(function () {
            return fs.makeTree(targetDir);
        }).nodeify(callback);
    },
    test1: function (test) {
        mc.convert(source, "200x200", path.join(targetDir))
            .catch(function (err) {
                console.log(err);
            }).done(function () {
                console.log("done");
                test.done();
            });
    }
}
