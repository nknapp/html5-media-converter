var VideoConverter = require("../src/VideoConverter.js");
var fs = require("fs");
var path = require("path");

var source = path.resolve(__dirname, "../testdata/video.mp4");
var unstreamableSource = path.resolve(__dirname, "../testdata/unstreamableVideo.mp4");
var targetDir = path.resolve(__dirname, "../tmp");
require("long-stack-traces");

require("q").longStackSupport = true;
var qfs = require("q-io/fs");

module.exports.setUp = function (callback) {
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

exports.testMp4 = function (test) {
    var converter = VideoConverter.defaults.mp4;
    var readStream = fs.createReadStream(source);
    var ffmpegStream = converter.toStream("200x200");
    var outStream = fs.createWriteStream(path.join(targetDir, "targetStream" + converter.extName()));
    readStream.on("error",console.log).pipe(ffmpegStream).on("error",console.log).pipe(outStream).on("error",console.log);
    outStream.on("finish", function() {
        converter.convert(source,"200x200",path.join(targetDir, "targetConvert" + converter.extName()),function(err) {
            test.ok(!err);
            test.ok(fs.existsSync(path.join(targetDir,"targetStream.mp4")));
            test.ok(fs.existsSync(path.join(targetDir,"targetConvert.mp4")));
            test.done();
        });
    });
};

exports.testFfmpegError = function (test) {
    var converter = VideoConverter.defaults.mp4;
    var readStream = fs.createReadStream(unstreamableSource);
    var ffmpegStream = converter.toStream("200x200");
    var outStream = fs.createWriteStream(path.join(targetDir, "targetError" + converter.extName()));
    readStream.on("error",console.log).pipe(ffmpegStream).on("error",function() {
        test.done();
    }).pipe(outStream).on("error",console.log);
};


exports.testOgv = function (test) {
    var converter = VideoConverter.defaults.ogv;
    var readStream = fs.createReadStream(source);
    var ffmpegStream = converter.toStream("200x200");
    var outStream = fs.createWriteStream(path.join(targetDir, "targetStream" + converter.extName()));
    readStream.pipe(ffmpegStream).pipe(outStream);
    readStream.on("error",console.log);
    outStream.on("finish", function() {
        converter.convert(source,"200x200",path.join(targetDir, "targetConvert" + converter.extName()),function(err) {
            test.ok(!err);
            test.ok(fs.existsSync(path.join(targetDir,"targetStream.ogv")));
            test.ok(fs.existsSync(path.join(targetDir,"targetConvert.ogv")));
            test.done();
        });
    });
};


exports.testWebm = function (test) {
    var converter = VideoConverter.defaults.webm;
    var readStream = fs.createReadStream(source);
    var ffmpegStream = converter.toStream("200x200");
    var outStream = fs.createWriteStream(path.join(targetDir, "targetStream" + converter.extName()));
    readStream.pipe(ffmpegStream).pipe(outStream);
    readStream.on("error",console.log);
    outStream.on("finish", function() {
        converter.convert(source,"200x200",path.join(targetDir, "targetConvert" + converter.extName()),function(err) {
            test.ok(!err);
            test.ok(fs.existsSync(path.join(targetDir,"targetStream.webm")));
            test.ok(fs.existsSync(path.join(targetDir,"targetConvert.webm")));
            test.done();
        });
    });
};
